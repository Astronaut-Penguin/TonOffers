// REACT
import React, { useState, useEffect } from 'react';

// STYLES
import styles from './PaymentChannel.module.css';

// BOOTSTRAP COMPONENTS
import { Form } from 'react-bootstrap';

// OUR COMPONENTS
import { Button_Action } from '../../components';

type PaymentChannelProps = {
	style?: React.CSSProperties;
};

////////////////////
// COMPONENT VIEW //
////////////////////
const PaymentChannel: React.FC<PaymentChannelProps> = ({ style }) => {
	////////////////////
	// FORM FUNCTIONS //
	////////////////////

	// STATES
	// User Data for Register
	const [data, setData] = useState({
		type: 1,

		from: '',
		to: '',
		contractorBalance: 0,
		invitedBalance: 0,
		seqContractor: 0,
		secInvited: 0,

		signature: '',
	});
	const [checked, setChecked] = useState<boolean>(false);
	// Catch values
	const {
		type,
		from,
		to,
		contractorBalance,
		invitedBalance,
		seqContractor,
		secInvited,
		signature,
	} = data;

	// Catch Input Values
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		setData({
			...data,
			[e.target.name]: value,
		});
	};

	// Catch Input Values
	const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setData({
			...data,
			[e.target.name]: value,
		});
	};

	////////////
	// RENDER //
	////////////
	return (
		<section style={style} className={styles.Container}>
			<div className={styles.FormContainer}>
				<h2 className={styles.Title}>Payment Channel</h2>
				<Form.Label className={styles.Label}>Who are you?</Form.Label>
				<Form.Select size="lg" value={type} name="type" onChange={handleSelect}>
					<option value="1">I'm the Buyer</option>
					<option value="2">I'm the Seller</option>
				</Form.Select>

				<br />

				<div className={styles.GroupContainer}>
					<Form>
						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>FROM Address</Form.Label>
								<p className={styles.Label}>Wallet Acá</p>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>TO Address</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={50}
									onChange={handleChange}
									value={to}
									name="to"
									type="to"
									placeholder="TO Address"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>
									Contractor Balance
								</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={20}
									onChange={handleChange}
									value={contractorBalance}
									name="contractorBalance"
									type="number"
									placeholder="0"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>
									Invited Balance
								</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={20}
									onChange={handleChange}
									value={invitedBalance}
									name="invitedBalance"
									type="number"
									placeholder="0"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>SEQ Contractor</Form.Label>
								<p className={styles.Label}>0</p>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>SEQ Invited</Form.Label>
								<p className={styles.Label}>0</p>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>Signature</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={256}
									onChange={handleChange}
									value={signature}
									name="signature"
									type="text"
									placeholder="Signature"
								/>
							</Form.Group>
						</div>
					</Form>
				</div>
			</div>
			<div className={styles.Container_Buttons}>
				<Button_Action text="Create Channel" onClick={() => {}} />
				<Button_Action text="Aprobe Payment" onClick={() => {}} />
			</div>
		</section>
	);
};

export default PaymentChannel;
