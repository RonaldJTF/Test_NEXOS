import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { By } from '@angular/platform-browser';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-test-host',
  template: `<app-loading [styleClass]="styleClass"></app-loading>`,
  imports: [LoadingComponent]
})
class TestHostComponent {
  styleClass: string = 'custom-class';
}

describe('LoadingComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ProgressSpinner]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render the loading spinner', () => {
    const spinner = fixture.debugElement.query(By.css('p-progressSpinner'));
    expect(spinner).toBeTruthy();
  });

  it('should apply the custom styleClass to the container', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(div.classList).toContain('custom-class');
  });
});