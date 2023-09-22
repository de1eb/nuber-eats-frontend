import { graphql } from "./gql";

export const RESTAURANT_FRAGMENT = graphql(`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`);

// const Restaurant_Fragment = graphql(`
//   fragment RestaurantParts on Restaurant {
//     id
//     name
//     coverImg
//     category {
//       name
//     }
//     address
//     isPromoted
//   }
// `)

// type RestaurantProps = {
//   restaurant: FragmentType<typeof Restaurant_Fragment>
// }

// export function Restaurant(props: RestaurantProps) {
//   const restaurant = useFragment(Restaurant_Fragment, props.restaurant)
//   return
// }