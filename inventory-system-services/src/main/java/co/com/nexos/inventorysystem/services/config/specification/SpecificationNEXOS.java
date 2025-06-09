package co.com.nexos.inventorysystem.services.config.specification;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * Allows building queries based on the non-null attributes provided in the object.
 * Records can be sorted using the 'orderBy' object passed as a parameter in the constructor.
 * If a sorting property is an attribute of a nested object (i.e., an attribute of an attribute... of the root object),
 * these must be separated by a dot (.), for example, from the 'Persona' class object (root object),
 * if you want to sort by the 'name' attribute of its 'documentType' attribute (from the 'TipoDocumento' class),
 * the syntax to use is documentType.name for the sorting property.
 */
public class SpecificationNEXOS<T> implements Specification<T> {

    private final T filter;
    private OrderBy orderBy;

    public SpecificationNEXOS(T filter) {
        this.filter = filter;
    }

    public SpecificationNEXOS(T filter, OrderBy orderBy) {
        this.filter = filter;
        this.orderBy = orderBy;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = generatePredicate(root, criteriaBuilder, filter.getClass(), filter);
        if (orderBy != null) {
            List<Order> orders = new ArrayList<>();
            for (OrderBy.OrderSpecifier orderSpecifier : orderBy.getOrderSpecifiers()) {
                Path<Object> orderPath = getPath(root, orderSpecifier.getProperty());
                Order order = orderSpecifier.isAscending() ? criteriaBuilder.asc(orderPath) : criteriaBuilder.desc(orderPath);
                orders.add(order);
            }
            query.orderBy(orders);
        }
        return predicate;
    }

    private <E> Path<Object> getPath(Path<E> path, String property) {
        if (property.contains(".")) {
            String[] nestedProperties = property.split("\\.");
            Path<Object> nestedPath = path.get(nestedProperties[0]);
            for (int i = 1; i < nestedProperties.length; i++) {
                nestedPath = nestedPath.get(nestedProperties[i]);
            }
            return nestedPath;
        } else {
            return path.get(property);
        }
    }

    private <E> Predicate generatePredicate(Path<E> path, CriteriaBuilder criteriaBuilder, Class<?> entityClass, Object filterObject) {
        List<Predicate> predicates = new ArrayList<>();
        Field[] fields = entityClass.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            try {
                Object value = field.get(filterObject);
                if (value != null) {
                    if (field.getType().equals(String.class)) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.upper(path.get(field.getName())), "%" + value.toString().toUpperCase() + "%"));
                    } else if (field.getType().isPrimitive() || Number.class.isAssignableFrom(field.getType())) {
                        predicates.add(criteriaBuilder.equal(path.get(field.getName()), value));
                    }else if (Date.class.isAssignableFrom(field.getType()) ||
                                java.sql.Date.class.isAssignableFrom(field.getType()) ||
                                java.sql.Time.class.isAssignableFrom(field.getType()) ||
                                java.sql.Timestamp.class.isAssignableFrom(field.getType())) {
                        predicates.add(criteriaBuilder.equal(path.get(field.getName()), value));
                    } else {
                        Path<Object> nestedPath = path.get(field.getName());
                        predicates.add(this.generatePredicate(nestedPath, criteriaBuilder, field.getType(), value));
                    }
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
