import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('* => slideFromRight', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '100%', opacity: 0 })
      ], { optional: true }),
      query(':leave', [
        style({ left: 0, opacity: 1 })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({ left: '-100%', opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-in-out', style({ left: '0%', opacity: 1 }))
        ], { optional: true })
      ])
    ]),
    transition('slideFromRight => *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', style({ left: '-100%' }), { optional: true }),
      group([
        query(':enter', [
          animate('300ms ease-in-out', style({ left: '0%' }))
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-in-out', style({ left: '100%' }))
        ], { optional: true })
      ])
    ])
  ]);