import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AppComponent } from './app.component'

beforeEach(() => TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  // Provide an empty router as no routes are needed for this test
  providers: [provideRouter([])],
}));

it('should instantiate the AppComponent successfully', () => {
  const appFixture = TestBed.createComponent(AppComponent)
  const app = appFixture.componentInstance
  expect(app).toBeTruthy()
})

