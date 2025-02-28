// "use client";
// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import axios from "axios";

// // Define Product Interface
// interface Product {
//   _id?: string;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   storeName: string;
//   rating: { rate: number; count: number };
//   favoritedBy: string[];
//   isActive: boolean;
// }

// const AdminProductPage: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [formData, setFormData] = useState<Product>({
//     title: "",
//     price: 0,
//     description: "",
//     category: "",
//     image: "",
//     storeName: "",
//     rating: { rate: 0, count: 0},
//     favoritedBy: [],
//     isActive: true,
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Fetch Products
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/product/products");
//       setProducts(res.data.products || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]);
//     }
//   };

//   // Handle Delete
//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/product/delete/${id}`);
//       fetchProducts();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...formData,
//         rating: formData.rating || { rate: 0, count: 0 },
//         favoritedBy: formData.favoritedBy || [],
//         isActive: formData.isActive ?? true,
//       };

//       if (formData._id) {
//         // Update existing product
//         await axios.put(`http://localhost:4000/api/product/update/${formData._id}`, payload);
//       } else {
//         // Create new product
//         await axios.post("http://localhost:4000/api/product/create", payload);
//       }

//       fetchProducts();
//       setFormData({
//         title: "",
//         price: 0,
//         description: "",
//         category: "",
//         image: "",
//         storeName: "",
//         rating: { rate: 0, count: 0 },
//         favoritedBy: [],
//         isActive: true,
//       });
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

  
  

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Admin Product Management</h2>

//       {/* Product Form */}
//       <form onSubmit={handleSubmit} className="mb-6">
//         <div className="grid grid-cols-2 gap-4">
//           <input type="text" name="title" placeholder="Title" value={formData.title} className="border p-2" onChange={handleInputChange} required />
//           <input type="number" name="price" placeholder="Price" value={formData.price} className="border p-2" onChange={handleInputChange} required />
//           <input type="text" name="category" placeholder="Category" value={formData.category} className="border p-2" onChange={handleInputChange} required />
//           <input type="text" name="image" placeholder="Image URL" value={formData.image} className="border p-2" onChange={handleInputChange} required />
//           <input type="text" name="storeName" placeholder="Store Name" value={formData.storeName} className="border p-2" onChange={handleInputChange} required />
//           <input type="number" name="Rating" placeholder="Rating" value={formData.rating.rate} className="border p-2" onChange={handleInputChange} required />
//           <input type="number" name="Count" placeholder="Rating" value={formData.rating.count} className="border p-2" onChange={handleInputChange} required />
//           <textarea name="description" placeholder="Description" value={formData.description} className="border p-2 col-span-2" onChange={handleInputChange} required />
//         </div>
//         <button type="submit" className="mt-4 bg-yellow-500 text-white px-4 py-2">
//           {formData._id ? "Update Product" : "Create Product"}
//         </button>
//       </form>

//       {/* Product List */}
//       {products.length > 0 ? (
//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Title</th>
//               <th className="border p-2">Image</th>
//               <th className="border p-2">Category</th>
//               <th className="border p-2">Price</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product._id} className="border">
//                 <td className="p-2">{product.title}</td>
//                 <td className="p-2"><img className="h-10 w-10" src={product.image} alt={product.title} /></td>
//                 <td className="p-2">{product.category}</td>
//                 <td className="p-2">Rs {product.price}</td>
//                 <td className="p-2 flex space-x-2">
//                   {/* <button className="bg-yellow-500 text-white px-2 py-1" onClick={() => setFormData(product)}>
//                     Edit
//                   </button> */}

//                   <button className="bg-yellow-500 text-white px-2 py-1" onClick={() => setFormData({ ...product })}>
//                     Edit
//                   </button>

//                   <button className="bg-red-500 text-white px-2 py-1" onClick={() => product._id && handleDelete(product._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-gray-500 text-center mt-4">No products found.</p>
//       )}
//     </div>
//   );
// };

// export default AdminProductPage;







"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Define Product Interface
interface Product {
  _id?: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  storeName: string;
  rating: { rate: number; count: number };
  favoritedBy: string[];
  isActive: boolean;
}

const AdminProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Product>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    storeName: "",
    rating: { rate: 0, count: 0 },
    favoritedBy: [],
    isActive: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/product/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/product/delete/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle Input Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Check if input is part of the rating object
    if (name === "rate" || name === "count") {
      setFormData({
        ...formData,
        rating: {
          ...formData.rating,
          [name]: Number(value), // Ensure numerical input
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Submit (Create or Update Product)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        rating: formData.rating || { rate: 0, count: 0 },
        favoritedBy: formData.favoritedBy || [],
        isActive: formData.isActive ?? true,
      };

      if (formData._id) {
        await axios.put(`http://localhost:4000/api/product/update/${formData._id}`, payload);
      } else {
        await axios.post("http://localhost:4000/api/product/create", payload);
      }

      fetchProducts();
      setFormData({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        storeName: "",
        rating: { rate: 0, count: 0 },
        favoritedBy: [],
        isActive: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Product Management</h2>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Title" value={formData.title} className="border p-2" onChange={handleInputChange} required />
          <input type="number" name="price" placeholder="Price" value={formData.price} className="border p-2" onChange={handleInputChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} className="border p-2" onChange={handleInputChange} required />
          <input type="text" name="image" placeholder="Image URL" value={formData.image} className="border p-2" onChange={handleInputChange} required />
          <input type="text" name="storeName" placeholder="Store Name" value={formData.storeName} className="border p-2" onChange={handleInputChange} required />
          <input type="number" name="rate" placeholder="Rating" value={formData.rating.rate} className="border p-2" onChange={handleInputChange} required />
          <input type="number" name="count" placeholder="Count" value={formData.rating.count} className="border p-2" onChange={handleInputChange} required />

          <textarea name="description" placeholder="Description" value={formData.description} className="border p-2 col-span-2" onChange={handleInputChange} required />
        </div>

        <button type="submit" className="mt-4 bg-yellow-500 text-white px-4 py-2">
          {formData._id ? "Update Product" : "Create Product"}
        </button>
      </form>

      {/* Product List */}
      {products.length > 0 ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border">
                <td className="p-2">{product.title}</td>
                <td className="p-2">
                  <img className="h-10 w-10" src={product.image} alt={product.title} />
                </td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">Rs {product.price}</td>
                <td className="p-2 flex space-x-2">
                  <button className="bg-yellow-500 text-white px-2 py-1" onClick={() => setFormData({ ...product })}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1" onClick={() => product._id && handleDelete(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-4">No products found.</p>
      )}
    </div>
  );
};

export default AdminProductPage;
