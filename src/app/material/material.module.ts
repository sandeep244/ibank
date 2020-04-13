import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';


@NgModule({
  imports: [ BrowserAnimationsModule, MatIconModule, MatInputModule, MatListModule ],
  exports: [ BrowserAnimationsModule, MatIconModule, MatInputModule, MatListModule ]
})
export class MaterialModule { }
