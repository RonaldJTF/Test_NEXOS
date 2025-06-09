import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FunctionalityComponent } from './functionality.component';
import { Functionality } from '@models';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-test-host',
  template: `<app-functionality [functionality]="functionality"></app-functionality>`,
  imports: [FunctionalityComponent]
})
class TestHostComponent {
  functionality: Functionality = {
    icon: 'pi-star',
    label: 'Test Feature',
    description: 'This is a test description'
  };
}

describe('FunctionalityComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should display the correct icon class', () => {
    const iconElement = fixture.debugElement.query(By.css('i')).nativeElement;
    expect(iconElement.className).toContain('pi');
    expect(iconElement.className).toContain(hostComponent.functionality.icon);
  });

  it('should display the correct label', () => {
    const labelElement = fixture.debugElement.query(By.css('h5')).nativeElement;
    expect(labelElement.textContent.trim()).toBe(hostComponent.functionality.label);
  });

  it('should display the correct description', () => {
    const descriptionElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(descriptionElement.textContent.trim()).toBe(hostComponent.functionality.description);
  });
});
