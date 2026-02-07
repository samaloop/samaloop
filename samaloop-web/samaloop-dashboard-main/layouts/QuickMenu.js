import Link from 'next/link';
import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Dropdown,
    ListGroup,
} from 'react-bootstrap';
import {
    User
} from 'react-feather';
import { useAuth } from 'app/context/AuthContext';
import Swal from 'sweetalert2';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import useMounted from 'hooks/useMounted';
import axios from 'axios';
import { mutate } from 'swr';

const QuickMenu = () => {
    const { userValue, userStore } = useAuth();
    const supabase = createClientComponentClient();

    const logout = async () => {
        Swal.fire({
            title: 'Please Wait',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        await supabase.auth.signOut();
        const update = await axios.get('/api/auth/get-user');
        mutate('/api/auth/get-user', update.data);
        await userStore(null);
    };

    const hasMounted = useMounted();
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    });

    const QuickMenuDesktop = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <span className="avatar avatar-md avatar-secondary">
                            <User className="avatar-initials rounded-circle fs-6" />
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                        show
                    >
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1">
                                <h5 className="mb-1">
                                    {userValue !== null && userValue.user.user_metadata.name !== undefined ? userValue.user.user_metadata.name : userValue.user.email}
                                </h5>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item as="div">
                            <Link href={'/user/change-password'} className="text-dark">
                                <i className="fe fe-lock me-2"></i> Change Password
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item as="div" onClick={logout}>
                            <Link href={'#'} className="text-dark">
                                <i className="fe fe-power me-2"></i>Sign Out
                            </Link>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        )
    }

    const QuickMenuMobile = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <span className="avatar avatar-md avatar-secondary">
                            <User className="avatar-initials rounded-circle fs-6" />
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                    >
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1">
                                <h5 className="mb-1">
                                    {userValue !== null && userValue.user.user_metadata.name !== undefined ? userValue.user.user_metadata.name : userValue.user.email}
                                </h5>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link href={'/user/change-password'}>
                                <i className="fe fe-lock me-2"></i> Change Password
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={logout}>
                            <Link href={'#'} className="text-dark">
                                <i className="fe fe-power me-2"></i>Sign Out
                            </Link>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        )
    }

    return (
        <Fragment>
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;