'use client'

import Link from 'next/link';
import {
	ListGroup,
	Image,
	OverlayTrigger,
	Tooltip,
	Stack,
	Navbar
} from 'react-bootstrap';
import {
	FiUsers,
	FiHome,
	FiSettings
} from "react-icons/fi";
import {
	FaUsers,
	FaTransgender,
	FaHistory,
	FaAsterisk,
	FaCodeBranch,
	FaClock,
	FaUserClock,
	FaUserTag,
	FaMoneyBill,
	FaUser,
	FaInfo
} from "react-icons/fa";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { useState, useEffect } from 'react';
import { useAuth } from 'app/context/AuthContext';
import { v4 as uuid } from 'uuid';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Accordion from 'react-bootstrap/Accordion';
import { FaUserTie } from 'react-icons/fa6';

const NavbarVertical = (props) => {
	const supabase = createClientComponentClient();
	const pathname = usePathname();
	const params = useParams();
	const router = useRouter();

	const [company, setCompany] = useState(null);
	const [quotation, setQuotation] = useState(null);
	const [placement, setPlacement] = useState(null);
	useEffect(() => {
		async function getCompany() {
			const companies = await supabase.from('companies').select('insurance_company').eq('id', params.id);
			if (companies.data !== null) {
				setCompany(companies.data[0]);
			}
		}
		async function getQuotation() {
			const quotation = await supabase.from('prospects').select('insurance_type').eq('id', params.id);
			if (quotation.data !== null) {
				setQuotation(quotation.data[0]);
			}
		}
		async function getPlacement() {
			const placement = await supabase.from('prospects').select('insurance_type').eq('id', params.id);
			if (placement.data !== null) {
				setPlacement(placement.data[0]);
			}
		}

		if (pathname.search('/user/superadmin/company/profile') > -1 || pathname.search('/user/superadmin/company/user') > -1 || pathname.search('/user/superadmin/company/product') > -1) {
			getCompany();
		}

		if (pathname.search('/user/broker/quotation/detail') > -1 || pathname.search('/user/broker/quotation/data') > -1 || pathname.search('/user/broker/quotation/proposal') > -1) {
			getQuotation();
		}

		if (pathname.search('/user/broker/placement/detail') > -1 || pathname.search('/user/broker/placement/data') > -1) {
			getPlacement();
		}
	}, [pathname]);

	const { userValue } = useAuth();
	const [isMounted, setIsMounted] = useState(false);
	const [sideMenu, setSideMenu] = useState(null);
	useEffect(() => {
		if (userValue !== null && isMounted === false) {
			const menuUser = [
				{
					id: uuid(),
					title: 'Dashboard',
					icon: <FiHome />,
					link: '/user',
					activePath: [
						'/user'
					]
				},
				{
					id: uuid(),
					grouptitle: true
				},
				{
					id: uuid(),
					title: 'Info',
					icon: <FaInfo />,
					link: '/user/info',
					activePath: [
						'/user/info'
					]
				},
				{
					id: uuid(),
					grouptitle: true
				},
				{
					id: uuid(),
					title: 'Coach',
					icon: <FaUsers />,
					activePath: [
						'/user/profile'
					],
					children: [
						{
							id: uuid(),
							name: 'Profile',
							link: '/user/profile',
							activePath: [
								'/user/profile'
							]
						}
					]
				},
				{
					id: uuid(),
					grouptitle: true
				},
				{
					id: uuid(),
					title: 'Master Data',
					icon: <FiSettings />,
					activePath: [
						'/user/gender',
						'/user/age',
						'/user/credential',
						'/user/speciality',
						'/user/method',
						'/user/hour',
						'/user/year',
						'/user/clients',
						'/user/client-type',
						'/user/price',	
						'/user/leads'
					],
					children: [
						{
							id: uuid(),
							name: 'Genders',
							link: '/user/gender',
							activePath: [
								'/user/gender'
							]
						},
						{
							id: uuid(),
							name: 'Ages',
							link: '/user/age',
							activePath: [
								'/user/age'
							]
						},
						{
							id: uuid(),
							name: 'Credentials',
							link: '/user/credential',
							activePath: [
								'/user/credential'
							]
						},
						{
							id: uuid(),
							name: 'Specialities',
							link: '/user/speciality',
							activePath: [
								'/user/speciality'
							]
						},
						{
							id: uuid(),
							name: 'Methods',
							link: '/user/method',
							activePath: [
								'/user/method'
							]
						},
						{
							id: uuid(),
							name: 'Hours',
							link: '/user/hour',
							activePath: [
								'/user/hour'
							]
						},
						{
							id: uuid(),
							name: 'Years',
							link: '/user/year',
							activePath: [
								'/user/year'
							]
						},
						{
							id: uuid(),
							name: 'Clients',
							link: '/user/clients',
							activePath: [
								'/user/clients'
							]
						},
						{
							id: uuid(),
							name: 'Client Types',
							link: '/user/client-type',
							activePath: [
								'/user/client-type'
							]
						},
						{
							id: uuid(),
							name: 'Prices',
							link: '/user/price',
							activePath: [
								'/user/price'
							]
						},
						{
							id: uuid(),
							name: 'Leads',
							link: '/user/leads',
							activePath: [
								'/user/leads'
							]
						},
					]
				},
				{
					id: uuid(),
					grouptitle: true
				},
				{
					id: uuid(),
					title: 'Admins',
					icon: <FiUsers />,
					link: '/user/admin',
					activePath: [
						'/user/admin'
					]
				}
			];

			setSideMenu(menuUser);

			setIsMounted(true);
		}
	}, [userValue]);

	const menuLevel1ItemClick = (link) => {
		if (params.id !== undefined) {
			router.push(link + '/' + params.id);
		} else {
			router.push(link);
		}
	};

	const menuLevel2ItemClick = (link) => {
		link = link.replace('$params1', params.id);
		router.push(link);
	};

	const checkMenuActive = (activeMenu) => {
		for (const value of activeMenu) {
			if (pathname.search(value) > -1) {
				return true;
			}
		}
		return false;
	};

	const checkMenuActive2 = (activeMenu) => {
		for (let value of activeMenu) {
			if (pathname.search(value.replace('$params1', params.id)) > -1) {
				return true;
			}
		}
		return false;
	};

	return (
		<Stack direction="horizontal">
			<div className="navbar-vertical navbar">
				<SimpleBar style={{ height: '100vh' }}>
					<div className="nav-scroller">
						<Link href="/" className="navbar-brand">
							<span className="avatar avatar-md avatar-secondary">
								<Image
									className="fs-6"
									src="/images/icon.png"
									alt="Logo"
									width={40}
									height={39} />
							</span>
						</Link>
					</div>
					<div className="navbar-nav">
						{sideMenu !== null && sideMenu.map(function (menu, index) {
							if (menu.hide) {
								return (
									<div key={uuid()} />
								);
							} else if (menu.grouptitle) {
								return (
									<div key={uuid()} className="navbar-divider mb-1" />
								);
							} else {
								if (menu.children) {
									return (
										<OverlayTrigger
											placement="right"
											overlay={
												<Tooltip id="button-tooltip" {...props}>
													{menu.title}
												</Tooltip>
											}
											key={uuid()}
										>
											<Link prefetch={false} href={menu.children[0].children ? menu.children[0].children[0].link : menu.children[0].link} className={`nav-link ${checkMenuActive(menu.activePath) === true ? 'active' : ''} ${menu.title === 'Download' ? 'bg-primary text-white' : ''}`}>
												{typeof menu.icon === 'string' ? (
													<i className={`fe fe-${menu.icon}`}></i>
												) : (menu.icon)}
											</Link>
										</OverlayTrigger>
									);
								} else {
									return (
										<OverlayTrigger
											placement="right"
											overlay={
												<Tooltip id="button-tooltip" {...props}>
													{menu.title}
												</Tooltip>
											}
											key={uuid()}
										>
											<Link prefetch={false} href={menu.link} className={`nav-link ${menu.title === 'Dashboard' && menu.activePath.includes(pathname) ? 'active' : menu.title !== 'Dashboard' && checkMenuActive(menu.activePath) === true ? 'active' : ''} ${menu.title === 'Download' ? 'bg-primary text-white' : ''}`}>
												{typeof menu.icon === 'string' ? (
													<i className={`fe fe-${menu.icon}`}></i>
												) : (menu.icon)}
											</Link>
										</OverlayTrigger>
									);
								}
							}
						})}
					</div>
				</SimpleBar>
			</div>
			{sideMenu !== null && sideMenu.map(function (menu, index) {
				if (menu.children) {
					return (
						<div key={uuid()} className={`submenu ${checkMenuActive(menu.activePath) === true ? 'd-block' : 'd-none'}`}>
							<div className="header">
								<Navbar className="navbar-classic navbar navbar-expand-lg">
									<Stack direction="horizontal" className="submenu-header">
										{menu.title}
									</Stack>
								</Navbar>
							</div>
							<div className="submenu-content">
								<SimpleBar style={{ height: '100vh' }}>
									<ListGroup variant="flush">
										{menu.children.map(function (menuLevel1Item, menuLevel1Index) {
											if (menuLevel1Item.children) {
												return (
													<Accordion defaultActiveKey={checkMenuActive(menuLevel1Item.activePath) === true ? '0' : ''} flush key={uuid()}>
														<Accordion.Item eventKey="0">
															<Accordion.Header color='#000'>{menuLevel1Item.title}</Accordion.Header>
															<Accordion.Body>
																<ListGroup variant="flush">
																	{menuLevel1Item.children.map(function (menuLevel2Item, menuLevel2Index) {
																		return (
																			<ListGroup.Item key={uuid()}>
																				{
																					menuLevel2Item.click ?
																						<a href="#" onClick={() => menuLevel2ItemClick(menuLevel2Item.link)} className={`nav-link ${checkMenuActive2(menuLevel2Item.activePath) === true ? 'active' : ''}`}>
																							{menuLevel2Item.name}
																						</a>
																						:
																						<Link href={menuLevel2Item.link} className={`nav-link ${checkMenuActive2(menuLevel2Item.activePath) === true ? 'active' : ''}`}>
																							{menuLevel2Item.name}
																						</Link>

																				}
																				{/* <Link href={menuLevel2Item.link} className={`nav-link ${checkMenuActive(menuLevel2Item.activePath) === true ? 'active' : ''}`}>
																					{menuLevel2Item.name}
																				</Link> */}
																			</ListGroup.Item>
																		)
																	})}
																</ListGroup>
															</Accordion.Body>
														</Accordion.Item>
													</Accordion>
												)
											} else {
												return (
													<div key={uuid()}>
														<>
															{
																menuLevel1Item.link === '/user/superadmin/company/product' && company !== null && company.insurance_company === true &&
																<ListGroup.Item key={uuid()}>
																	{
																		menuLevel1Item.click ?
																			<a href="#" onClick={() => menuLevel1ItemClick(menuLevel1Item.link)} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</a>
																			:
																			<Link href={menuLevel1Item.link} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</Link>

																	}
																</ListGroup.Item>
															}
														</>
														<>
															{
																menuLevel1Item.link === '/user/broker/quotation/data' && quotation !== null &&
																<ListGroup.Item key={uuid()}>
																	{
																		menuLevel1Item.click ?
																			<a href="#" onClick={() => menuLevel1ItemClick(menuLevel1Item.link)} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</a>
																			:
																			<Link href={menuLevel1Item.link} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</Link>
																	}
																</ListGroup.Item>
															}
														</>
														<>
															{
																menuLevel1Item.link === '/user/broker/placement/data' && placement !== null &&
																<ListGroup.Item key={uuid()}>
																	{
																		menuLevel1Item.click ?
																			<a href="#" onClick={() => menuLevel1ItemClick(menuLevel1Item.link)} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</a>
																			:
																			<Link href={menuLevel1Item.link} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</Link>
																	}
																</ListGroup.Item>
															}
														</>
														<>
															{
																menuLevel1Item.link !== '/user/superadmin/company/product' && menuLevel1Item.link !== '/user/broker/quotation/data' && menuLevel1Item.link !== '/user/broker/placement/data' &&
																<ListGroup.Item key={uuid()}>
																	{
																		menuLevel1Item.click ?
																			<a href="#" onClick={() => menuLevel1ItemClick(menuLevel1Item.link)} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</a>
																			:
																			<Link href={menuLevel1Item.link} className={`nav-link ${checkMenuActive(menuLevel1Item.activePath) === true ? 'active' : ''}`}>
																				{menuLevel1Item.name}
																			</Link>
																	}
																</ListGroup.Item>
															}
														</>
													</div>
												)
											}
										})}
									</ListGroup>
								</SimpleBar>
							</div>
						</div>
					);
				}
			})}
		</Stack>
	);
};

export default NavbarVertical;
