import { trigger, style, transition, query, animateChild, group, animate } from "@angular/animations";


export const slideInAnimation =
  trigger('routeAnimations', [
    transition('* => DetailsPage', [
      style({ position: 'relative' }),
      query(':enter', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%'})
      ]),
      group([
        query(':enter', [
          animate('500ms ease-out', style({ left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('DetailsPage => ResultsPage, DetailsPage => FavoritesPage', [
        style({ position: 'relative' }),
        query(':enter', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ left: '100%'})
        ]),
        group([
          query(':enter', [
            animate('500ms ease-out', style({ left: '0%'}))
          ])
        ]),
        query(':enter', animateChild()),
      ])
  ]);