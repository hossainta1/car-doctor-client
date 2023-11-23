import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import BookingRow from './BookingRow';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([])
    const navigate = useNavigate();


    const url = `http://localhost:5000/bookings?email=${user?.email}`;

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('Car-doctor-access-token')}`

            }
        })
            .then(res => res.json())
            .then(data => {

                if (!data.error) {
                    setBookings(data)
                }

                else {

                    // logout and then navigate
                    
                    navigate('/')
                }


            })
    }, [url, navigate]);

    const handleDelete = id => {

        const procced = confirm('Are you sure you want to delete your booking?');
        if (procced) {

            fetch(`http://localhost:5000/bookings/${id}`, {

                method: 'DELETE',

            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        alert("Delete Booking Successfuly");

                        const remaining = bookings.filter(booking => booking._id !== id);

                        setBookings(remaining);
                    }

                })

        }

    }

    const hanldeBookingConfirm = id => {
        fetch(`http://localhost:5000/bookings/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'

            },

            body: JSON.stringify({ status: 'Confirm' })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.modifiedCount > 0) {

                    const remaining = bookings.filter(booking => booking._id !== id);
                    const updated = bookings.find(booking => booking._id === id);
                    updated.status = 'Confirm';
                    const newBookings = [updated, ...remaining];
                    setBookings(newBookings);

                }
            })
    }

    return (
        <div>
            <h2 className='text-5xl'>Your Bookings: {bookings.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    {
                        bookings.map(booking => <BookingRow
                            key={booking._id}
                            booking={booking}
                            handleDelete={handleDelete}
                            hanldeBookingConfirm={hanldeBookingConfirm}

                        ></BookingRow>)
                    }

                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bookings;