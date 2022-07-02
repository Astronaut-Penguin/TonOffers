// React
import React, { useEffect, useState } from 'react';

// Styles
import styles from './Header.module.css';

// Bootstrap Components
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
// Components
import ConnectWallet from '../Buttons/ConnectWallet/ConnectWallet';

// SVG
import Logo from './assets/Logo.svg';
import Burger from './assets/Burger.svg';
import Cross from './assets/Cross.svg';

// Props
type HeaderProps = {
	style?: React.CSSProperties;
};

const Header: React.FC<HeaderProps> = ({ style }) => {
	///////////////
	// FUNCTIONS //
	///////////////

	const [open, setOpen] = useState(false);

	//   Windows Size
	const [size, setSize] = useState(window.innerWidth);

	useEffect(() => {
		window.addEventListener('resize', () => {
			setSize(window.innerWidth);
		});
	}, []);

	////////////
	// RENDER //
	////////////
	return (
		<>
			<Navbar
				collapseOnSelect
				fixed="top"
				expand=""
				variant="dark"
				className={styles.Header}
			>
				<Container className={styles.Container}>
					<Navbar.Brand href="#home">
						<img alt="TON Workers" src={Logo} className={styles.Logo} />
						<span className={styles.Brand}>TON Workers</span>
					</Navbar.Brand>
					{size < 992 ? (
						<>
							<Button
								className={styles.Button}
								onClick={() => setOpen(!open)}
								aria-expanded={open}
							>
								{open ? (
									<img src={Cross} alt="Burger Button" />
								) : (
									<img src={Burger} alt="Burger Button" />
								)}
							</Button>
							<Navbar.Collapse in={open}>
								<ConnectWallet open={open} />
							</Navbar.Collapse>
						</>
					) : (
						<ConnectWallet open={open} />
					)}
				</Container>
			</Navbar>
		</>
	);
};

export default Header;
