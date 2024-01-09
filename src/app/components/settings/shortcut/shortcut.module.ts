import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutComponent } from './shortcut.component'; 
import { SharedModule } from '../../../shared/shared.module';




@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
  declarations: [
      ShortcutComponent,
  ],
  exports: [ShortcutComponent],
  providers: [

  ]
})
export class ShortCutModule {}
