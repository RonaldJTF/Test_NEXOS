CREATE USER nexos_user WITH PASSWORD 'nexos12345';

CREATE SCHEMA INVENTORY_SYSTEM AUTHORIZATION nexos_user;

SET search_path TO INVENTORY_SYSTEM;

--------------------------------CREATE MAIN TABLES--------------------------------

CREATE TABLE appointments (
	appointment_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	action TEXT NOT NULL
);

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	appointment_id INTEGER NOT NULL,
	name VARCHAR(255) NOT NULL,
	age INTEGER CHECK (age BETWEEN 0 AND 999),
	hire_date  TIMESTAMP NOT NULL,
	action TEXT NOT NULL,
	FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

CREATE TABLE products (
	product_id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	name VARCHAR(255) NOT NULL UNIQUE,
	stock INTEGER NOT NULL,
	entry_date TIMESTAMP NOT NULL,
	action TEXT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--------------------------------CREATE HISTORY TABLES--------------------------------

CREATE TABLE his_appointments (
	appointment_id INTEGER,
	name VARCHAR(255),
	action TEXT,
	operation VARCHAR(50)
);

CREATE TABLE his_users (
	user_id INTEGER,
	appointment_id INTEGER,
	name VARCHAR(255),
	age INTEGER,
	hire_date  TIMESTAMP,
	action TEXT,
	operation VARCHAR(50)
);

CREATE TABLE his_products (
	product_id INTEGER,
	user_id INTEGER,
	name VARCHAR(255),
	stock INTEGER,
	entry_date TIMESTAMP,
	action TEXT,
	operation VARCHAR(50)
);

--------------------------------CREATE FUNTIONS--------------------------------

CREATE OR REPLACE FUNCTION INVENTORY_SYSTEM.PR_D_APPOINTMENT(bigint, character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
		DECLARE
		BEGIN
			INSERT INTO INVENTORY_SYSTEM.his_appointments(
				appointment_id,
				name,
				action,
				operation
			)
			SELECT 
			appointment_id,
			name,	
			$2,
			'D'
			FROM INVENTORY_SYSTEM.appointments
			WHERE appointment_id=$1;

			DELETE FROM INVENTORY_SYSTEM.appointments WHERE appointment_id=$1;

			IF NOT FOUND THEN
				RETURN 0;
			ELSE 
				RETURN 1;
			END IF;
		END;
	$function$
;

CREATE OR REPLACE FUNCTION INVENTORY_SYSTEM.PR_D_USER(bigint, character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
		DECLARE
		BEGIN
			INSERT INTO INVENTORY_SYSTEM.his_users(
				user_id,
				appointment_id,
				name,
				age,
				hire_date,
				action,
				operation
			)
			SELECT 
			user_id,
			appointment_id,
			name,
			age,
			hire_date,
			$2,
			'D'
			FROM INVENTORY_SYSTEM.users
			WHERE user_id=$1;

			DELETE FROM INVENTORY_SYSTEM.users WHERE user_id=$1;

			IF NOT FOUND THEN
				RETURN 0;
			ELSE 
				RETURN 1;
			END IF;
		END;
	$function$
;

CREATE OR REPLACE FUNCTION INVENTORY_SYSTEM.PR_D_PRODUCT(bigint, character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
		DECLARE
		BEGIN
			INSERT INTO INVENTORY_SYSTEM.his_products(
				product_id,
				user_id,
				name,
				stock,
				entry_date,
				action,
				operation
			)
			SELECT 
			product_id,
			user_id,
			name,
			stock,
			entry_date,
			$2,
			'D'
			FROM INVENTORY_SYSTEM.products
			WHERE product_id=$1;

			DELETE FROM INVENTORY_SYSTEM.products WHERE product_id=$1;

			IF NOT FOUND THEN
				RETURN 0;
			ELSE 
				RETURN 1;
			END IF;
		END;
	$function$
;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA INVENTORY_SYSTEM TO nexos_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA INVENTORY_SYSTEM TO nexos_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA INVENTORY_SYSTEM TO nexos_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA INVENTORY_SYSTEM GRANT ALL PRIVILEGES ON TABLES TO nexos_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA INVENTORY_SYSTEM GRANT ALL PRIVILEGES ON SEQUENCES TO nexos_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA INVENTORY_SYSTEM GRANT ALL PRIVILEGES ON FUNCTIONS TO nexos_user;

INSERT INTO inventory_system.appointments(name, action) VALUES('Asesor de ventas', jsonb_build_object('date', now()));
INSERT INTO inventory_system.appointments(name, action) VALUES('Administrador', jsonb_build_object('date', now()));
INSERT INTO inventory_system.appointments(name, action) VALUES('Soporte', jsonb_build_object('date', now()));

INSERT INTO INVENTORY_SYSTEM.users(appointment_id, name, age, hire_date, action) VALUES(1, 'Gabriela Martinez Gamboa', 25, '2024-12-24', jsonb_build_object('date', now()));
INSERT INTO INVENTORY_SYSTEM.users(appointment_id, name, age, hire_date, action) VALUES(1, 'Maria Alexanda Vega Rivera', 32, '2025-01-01', jsonb_build_object('date', now()));
INSERT INTO INVENTORY_SYSTEM.users(appointment_id, name, age, hire_date, action) VALUES(2, 'Ronald Torres Flórez', 29, '2023-05-01', jsonb_build_object('date', now()));
INSERT INTO INVENTORY_SYSTEM.users(appointment_id, name, age, hire_date, action) VALUES(3, 'Miguel Antonio Castro Arce', 47, '2025-05-15', jsonb_build_object('date', now()));



