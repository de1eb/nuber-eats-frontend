import { Link } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../fragments";
import { FragmentType, useFragment } from "../gql";
// interface IrestaurantProps {
//   id: string;
//   coverImg: string;
//   name: string;
//   categoryName?: string;
// }
interface IRestaurantProps {
  restaurant: FragmentType<typeof RESTAURANT_FRAGMENT>;
}

export const Restaurant: React.FC<IRestaurantProps> = (props) => {
  const { id, coverImg, name, category } = useFragment(RESTAURANT_FRAGMENT, props.restaurant);
  return (
    <Link to={`/home/restaurants/${id}`}>
      <div className="flex flex-col">
        <div style={{ backgroundImage: `url('data:image/jpeg;base64, ${coverImg}')` }} className="bg-red-500 bg-cover bg-center mb-3 rounded py-28 mx-2"></div>
        <h3 className="text-xl font-medium mx-2">{name}</h3>
        <span className="border-t-2 border-gray-200 mx-2">{category?.name}</span>
      </div>
    </Link>
  );
};

// export const Restaurant: React.FC<IrestaurantProps> = ({ coverImg, name, categoryName }) => (
//   <div className="flex flex-col">
//     <div style={{ backgroundImage: `url(${coverImg})` }} className="bg-cover bg-center mb-3 py-28"></div>
//     <h3 className="text-xl">{name}</h3>
//     <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">{categoryName}</span>
//   </div>
// );
