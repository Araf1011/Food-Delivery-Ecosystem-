import burgerImg from '../assets/category pic/burger.jpg';
import pizzaImg from '../assets/category pic/pizza.jpg';
import chickenImg from '../assets/category pic/chicken.jpg';
import noodlesImg from '../assets/category pic/noodles.jpg';
import dessertImg from '../assets/category pic/dessert.jpg';
import coffeeImg from '../assets/category pic/coffee.jpg';
import healthyImg from '../assets/category pic/healthy.jpg';

export const RESTAURANTS = [
  {
    id: 'green-bowl-co',
    name: 'Green Bowl & Co.',
    image: healthyImg,
    rating: 4.9,
    reviews: 340,
    deliveryTime: '15–25 min',
    deliveryFee: 0,
    categories: ['healthy', 'sandwich'],
    tags: ['Healthy', 'Bowls', 'Vegan Friendly'],
    menu: [
      {
        id: 'gb-1',
        name: 'Harvest Sweet Potato Bowl',
        description:
          'Roasted sweet potato, sliced avocado, snap peas, caramelized mushrooms, quinoa & herb pesto.',
        price: 14.5,
        image: healthyImg,
        available: true,
      },
      {
        id: 'gb-2',
        name: 'Avocado Crunch Salad',
        description:
          'Mixed baby greens, cherry tomatoes, cucumber, toasted pumpkin seeds & lemon vinaigrette.',
        price: 12.0,
        image: healthyImg,
        available: true,
      },
      {
        id: 'gb-3',
        name: 'Grilled Herb Chicken Wrap',
        description:
          'Whole-wheat wrap with grilled chicken breast, avocado, crisp greens & garlic yogurt.',
        price: 11.5,
        image: chickenImg,
        available: true,
      },
    ],
  },
  {
    id: 'smokehouse-burger',
    name: 'Smokehouse Burger Lab',
    image: burgerImg,
    rating: 4.8,
    reviews: 520,
    deliveryTime: '20–30 min',
    deliveryFee: 1.99,
    categories: ['burger', 'chicken'],
    tags: ['Burger', 'American', 'Fries'],
    menu: [
      {
        id: 'sb-1',
        name: 'Double Smash Cheeseburger',
        description:
          'Two seared beef patties, aged cheddar, caramelized onions, pickles & house smoky sauce.',
        price: 13.5,
        image: burgerImg,
        available: true,
      },
      {
        id: 'sb-2',
        name: 'Crispy Chicken Burger',
        description:
          'Buttermilk fried chicken thigh, spicy slaw, cheddar & brioche bun.',
        price: 11.0,
        image: chickenImg,
        available: true,
      },
      {
        id: 'sb-3',
        name: 'Truffle Bacon Melt',
        description:
          'Prime patty, smoked beef bacon, swiss cheese, truffle mayo & crispy shallots.',
        price: 15.0,
        image: burgerImg,
        available: false,
      },
    ],
  },
  {
    id: 'napoli-woodfire',
    name: 'Napoli Woodfire Pizza',
    image: pizzaImg,
    rating: 4.7,
    reviews: 410,
    deliveryTime: '25–35 min',
    deliveryFee: 2.49,
    categories: ['pizza'],
    tags: ['Pizza', 'Italian', 'Wood-Fired'],
    menu: [
      {
        id: 'np-1',
        name: 'Classic Pepperoni & Basil',
        description:
          'San Marzano tomato sauce, fior di latte mozzarella, crispy pepperoni & fresh basil.',
        price: 16.0,
        image: pizzaImg,
        available: true,
      },
      {
        id: 'np-2',
        name: 'Margherita D.O.P.',
        description:
          'Wood-fired sourdough crust, crushed plum tomatoes, buffalo mozzarella & extra virgin olive oil.',
        price: 14.0,
        image: pizzaImg,
        available: true,
      },
      {
        id: 'np-3',
        name: 'Tiramisu Cup',
        description:
          'Espresso-soaked savoiardi layered with whipped mascarpone cream & cocoa.',
        price: 6.5,
        image: dessertImg,
        available: true,
      },
    ],
  },
  {
    id: 'kyoto-ramen-house',
    name: 'Kyoto Ramen House',
    image: noodlesImg,
    rating: 4.9,
    reviews: 285,
    deliveryTime: '20–30 min',
    deliveryFee: 0,
    categories: ['noodles', 'sushi'],
    tags: ['Noodles', 'Ramen', 'Japanese'],
    menu: [
      {
        id: 'kr-1',
        name: 'Tonkotsu Black Garlic Ramen',
        description:
          'Rich 12-hour broth, handmade wheat noodles, soft-boiled egg, scallions, nori & sesame.',
        price: 15.5,
        image: noodlesImg,
        available: true,
      },
      {
        id: 'kr-2',
        name: 'Spicy Miso Ramen',
        description:
          'Savory miso broth with chili oil, sweet corn, bamboo shoots & marinated egg.',
        price: 14.5,
        image: noodlesImg,
        available: true,
      },
      {
        id: 'kr-3',
        name: 'Crispy Karaage Chicken',
        description:
          'Japanese-style ginger-soy fried chicken bites with yuzu mayo.',
        price: 9.0,
        image: chickenImg,
        available: true,
      },
    ],
  },
  {
    id: 'crispy-coop',
    name: 'The Crispy Coop',
    image: chickenImg,
    rating: 4.6,
    reviews: 615,
    deliveryTime: '15–25 min',
    deliveryFee: 1.49,
    categories: ['chicken', 'burger'],
    tags: ['Chicken', 'Wings', 'Combos'],
    menu: [
      {
        id: 'cc-1',
        name: '6-Piece Golden Drumsticks',
        description:
          'Crunchy spiced coating, juicy tender chicken served with honey mustard & garlic dip.',
        price: 13.0,
        image: chickenImg,
        available: true,
      },
      {
        id: 'cc-2',
        name: 'Nashville Hot Tenders',
        description:
          'Crispy tenders brushed in smoky chili glaze with pickles & brioche toast.',
        price: 12.5,
        image: chickenImg,
        available: true,
      },
    ],
  },
  {
    id: 'velvet-bakery-cafe',
    name: 'Velvet Bakery & Roastery',
    image: dessertImg,
    rating: 4.9,
    reviews: 230,
    deliveryTime: '15–20 min',
    deliveryFee: 0,
    categories: ['dessert', 'coffee'],
    tags: ['Dessert', 'Coffee', 'Bakery'],
    menu: [
      {
        id: 'vb-1',
        name: 'Berry Swirl Chocolate Cupcake',
        description:
          'Rich dark cocoa sponge topped with whipped berry buttercream & fresh berries.',
        price: 5.5,
        image: dessertImg,
        available: true,
      },
      {
        id: 'vb-2',
        name: 'Artisan Flat White',
        description:
          'Double-shot single-origin espresso with velvety micro-foam.',
        price: 4.5,
        image: coffeeImg,
        available: true,
      },
      {
        id: 'vb-3',
        name: 'Iced Caramel Latte',
        description:
          'Chilled espresso, cold oat milk & house-made salted caramel.',
        price: 5.25,
        image: coffeeImg,
        available: true,
      },
    ],
  },
];
