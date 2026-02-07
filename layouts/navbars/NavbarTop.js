import Link from 'next/link';
import {
	Nav,
	Navbar,
	Breadcrumb
} from 'react-bootstrap';

import QuickMenu from 'layouts/QuickMenu';
import { useBreadcrumb } from 'app/context/BreadcrumbContext';

const NavbarTop = (props) => {
	const { breadcrumbValue } = useBreadcrumb();

	return (
		<Navbar expanded="lg" className="navbar-classic navbar navbar-expand-lg">
			<div className='d-flex justify-content-between w-100'>
				<div className="d-flex align-items-center">
					{
						breadcrumbValue !== null &&
						<Breadcrumb>
							{
								breadcrumbValue.map((value, index) => (
									<li className="breadcrumb-item" key={'breadcrumb' + index}>
										<Link href={value.href}>
											{value.title}
										</Link>
									</li>
								))
							}
						</Breadcrumb>
					}
				</div>
				<Nav className="navbar-right-wrap ms-2 d-flex nav-top-wrap">
					<QuickMenu />
				</Nav>
			</div>
		</Navbar>
	);
};

export default NavbarTop;
