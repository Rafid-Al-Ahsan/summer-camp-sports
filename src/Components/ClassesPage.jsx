/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "./provider/AuthProvider";
import Swal from "sweetalert2";
import useCart from "./hooks/useCart";
import axios from "axios";

const ClassesPage = () => {
    // TODO: If the user is not logged in, then tell the user to log in before selecting the course. This button will be disabled if: // Available seats are 0 Logged in as admin/instructor
    const [musicClasses, setMusicClasses] = useState([]);
    const[userRole , setUserRole] = useState('');

    const [, refetch] = useCart();
    
        const { user } = useContext(AuthContext);
        const navigate = useNavigate();
        const location = useLocation();

        fetch(`https://summer-camp-server-two-topaz.vercel.app/users/${user?.email}`)
        .then(response => response.json())
        .then(data => setUserRole(data[0]))
    
        useEffect(() => {
            fetch('https://summer-camp-server-two-topaz.vercel.app/classes')
                .then(response => response.json())
                .then(data => setMusicClasses(data))
        }, []); // Add an empty dependency array to run the effect only once after the component mounts


        const handleAddToCart = item => {
            const orderedClass = { classItemId: item._id, ClassName: item.ClassName, InstructorName: item.InstructorName, Email: item.Email, Price: item.Price, UserEmail: user?.email , Img: item.Img};
    
            if (user && user.email) {
                // Method1: Regular way
                // fetch('https://summer-camp-server-two-topaz.vercel.app/carts', {
                //     method: 'POST',
                //     headers: {
                //         "content-type": "application/json"
                //     },
                //     body: JSON.stringify(orderedClass)
                // })
                // .then(response => response.json())

                // Method2: Using axios in post function, cause post function in axios is easy
                axios.post('https://summer-camp-server-two-topaz.vercel.app/carts', orderedClass)
                    .then(data => {
                        if (data.data.insertedId) {
                            refetch();
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Your class has been added to the cart",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    })
            } 
            else {
                Swal.fire({
                    title: "Please login to add to the cart",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Login Now"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login', { state: { from: location } });
                    }
                });
            }
        }
    
        // Sort the classes by TotalStudent in descending order
        const sortedClasses = musicClasses.sort((a, b) => b.TotalStudent - a.TotalStudent);

    return (
        <div className="flex flex-col items-center justify-center pt-20 bg-[#f9efe2]">
        <p className="text-3xl font-bold my-5 italic">All Classes Offered By Melody Academy</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {sortedClasses.map(classItem => (
                classItem.Status === 'Approved' && <Card key={classItem._id} classItem={classItem} handleAddToCart={handleAddToCart} userRole={userRole}>
                </Card>
            ))}
        </div>
    </div>
    );
};

export default ClassesPage;

function Card({ classItem, handleAddToCart, userRole }) {
    return (
        <div className="card w-96 bg-base-100 mb-5">
            <figure><img className="w-96 h-60" src={classItem.Img} alt="Class" /></figure>
            <div className="card-body text-center">
                <h2 className="font-bold text-lg">{classItem.ClassName}</h2>
                <p><span className="text-[#d74949]">Instructor:</span> {classItem.InstructorName}</p>
                <p><span className="text-[#d74949]">Email:</span> {classItem.Email}</p>
                <p><span className="text-[#d74949]">Seats:</span> {classItem.Seats}</p>
                <p><span className="text-[#d74949]">Students:</span> {classItem.TotalStudent}</p>
                <p>$ {classItem.Price} (only once) </p>
                {userRole === 'Instructor' || userRole === 'Admin' ? <button onClick={() => handleAddToCart(classItem)} className="btn bg-[#b6c278]" disabled>Add To Cart</button> : 
                <button onClick={() => handleAddToCart(classItem)} className="btn bg-[#b6c278]" >Add To Cart</button>
                }
            </div>
        </div>
    )
}