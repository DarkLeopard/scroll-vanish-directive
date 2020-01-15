import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
}                        from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[scrollVanish]',
})
export class ScrollVanishDirective implements OnInit {
  @Input('scrollVanish') scrollArea;

  private hidden: boolean = false;
  private triggerDistance: number = 20;

  constructor(
      private elementRef: ElementRef,
      private renderer2: Renderer2,
      private domController: DomController,
  ) {}

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      const delta = scrollEvent.detail.deltaY;

      if ( scrollEvent.detail.currentY === 0 && this.hidden ) {
        this.show();
      } else if ( !this.hidden && delta > this.triggerDistance ) {
        this.hide();
      } else if ( this.hidden && delta < -this.triggerDistance ) {
        this.show();
      }
    });
  }

  initStyles() {
    this.domController.write(() => {
      this.renderer2.setStyle(
          this.elementRef.nativeElement,
          'transition',
          '0.2s linear',
      );
      this.renderer2.setStyle(this.elementRef.nativeElement, 'height', '44px');
    });
  }

  hide() {
    this.domController.write(() => {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'min-height', '0px');
      this.renderer2.setStyle(this.elementRef.nativeElement, 'height', '0px');
      this.renderer2.setStyle(this.elementRef.nativeElement, 'opacity', '0');
      this.renderer2.setStyle(this.elementRef.nativeElement, 'padding', '0');
    });

    this.hidden = true;
  }

  show() {
    this.domController.write(() => {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'height', '44px');
      this.renderer2.removeStyle(this.elementRef.nativeElement, 'opacity');
      this.renderer2.removeStyle(this.elementRef.nativeElement, 'min-height');
      this.renderer2.removeStyle(this.elementRef.nativeElement, 'padding');
    });

    this.hidden = false;
  }
}
