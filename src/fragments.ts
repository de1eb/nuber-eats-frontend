import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
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
`;

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