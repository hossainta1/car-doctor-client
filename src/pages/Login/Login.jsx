import { Link, json, useLocation, useNavigate } from 'react-router-dom';
import img from '../../assets/images/login/login.svg'
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';



const Login = () => {

    const { signIn } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);

        signIn(email, password)
            .then(result => {
                const user = result.user;
                const loggedUser = {
                    email: user.email
                }
                console.log(loggedUser);
                fetch('http://localhost:5000/jwt', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(loggedUser),
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log('jwt response', data);

                        // Warning : Local storage is not best option for (second best option) to store access tokens

                        localStorage.setItem('Car-doctor-access-token', data.token);
                        navigate(from, { replace: true })
                    })





            })
            .catch(error => console.log(error));

    };

    return (
        <div className="hero min-h-screen bg-base-200 mt-3">
            <div className="hero-content flex-col lg:flex-row">
                <div className="w-1/2 mr-12">

                    <img src={img} alt="" />
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleLogin}>
                        <h1 className="text-3xl text-center font-bold">Login now!</h1>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name='email' placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name='password' placeholder="password" className="input input-bordered" required />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">


                            <input className='btn btn-primary' type="submit" value="Login" />
                        </div>
                    </form>
                    <p className='my-4 text-center'>New to car doctor? <Link className='text-orange-500 font-bold' to='/signup'>Sign Up</Link> </p>
                </div>
            </div>
        </div>
    );
};

export default Login;