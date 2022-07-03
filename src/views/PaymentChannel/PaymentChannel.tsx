// REACT
import React, { useState, useEffect } from 'react';

// STYLES
import styles from './PaymentChannel.module.css';

// BOOTSTRAP COMPONENTS
import { Form } from 'react-bootstrap';

// OUR COMPONENTS
import { Button_Action } from '../../components';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
	closeChannel,
	createPaymentChannel,
	toHexString,
	updateChannel,
	verifyState,
} from '../../redux/reducers/ton_payment_reducer/payment_reducer';

type PaymentChannelProps = {
	style?: React.CSSProperties;
	hisPublicKey: string;
};

import { Store } from 'react-notifications-component';

////////////////////
// COMPONENT VIEW //
////////////////////
const PaymentChannel: React.FC<PaymentChannelProps> = ({
	style,
	hisPublicKey,
}) => {
	////////////////////
	// FORM FUNCTIONS //
	////////////////////

	const { myKeyPair } = useAppSelector((state) => state.ton);
	const dispatch = useAppDispatch();

	const myPublicKey = myKeyPair ? myKeyPair.publicKey : '';
	const myReadablePublicKey = myKeyPair ? toHexString(myPublicKey) : '';
	const myShortPublicKey = myKeyPair
		? myReadablePublicKey.slice(0, 6) +
		  '...' +
		  myReadablePublicKey.slice(
				myReadablePublicKey.length - 6,
				myReadablePublicKey.length,
		  )
		: '';

	const hisReadablePublicKey = hisPublicKey ? hisPublicKey : '';
	const hisShortPublicKey = myKeyPair
		? hisReadablePublicKey.slice(0, 6) +
		  '...' +
		  hisReadablePublicKey.slice(
				hisReadablePublicKey.length - 6,
				hisReadablePublicKey.length,
		  )
		: '';

	// STATES

	// User Data for Register
	const [data, setData] = useState({
		type: '1',
		typeTx: '1',
		my: '',
		his: '',
		myBalance: 0,
		hisBalance: 0,
		mySeqno: 0,
		hisSeqno: 0,
		channelNumber: 0,

		signature: 0,
	});
	const [checked, setChecked] = useState<boolean>(false);
	// Catch values
	const {
		type,
		typeTx,
		my,
		his,
		myBalance,
		hisBalance,
		mySeqno,
		hisSeqno,
		channelNumber,
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

	// Catch Input Values
	const handleSelectTx = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setData({
			...data,
			typeTx: value,
		});
	};

	// Tutorial
	const [tutorialShowed, setTutorialShowed] = useState(false);

	if (!tutorialShowed)
		setTimeout(() => {
			setTutorialShowed(true);
			Store.addNotification({
				title: 'Welcome to the payment section',
				message:
					'Here you can open,change and close channels. Please always start creating a channel, if not exist, we will trigger the deploy from your wallet',
				type: 'info',
				insert: 'top',
				container: 'top-center',
				animationIn: ['animate__animated', 'animate__fadeIn'],
				animationOut: ['animate__animated', 'animate__fadeOut'],
				dismiss: {
					duration: 10000,
					onScreen: true,
					pauseOnHover: true,
				},
				touchSlidingExit: {
					swipe: {
						duration: 400,
						timingFunction: 'ease-out',
						delay: 0,
					},
					fade: {
						duration: 400,
						timingFunction: 'ease-out',
						delay: 0,
					},
				},
			});
		}, 500);
	////////////
	// RENDER //
	////////////
	return (
		<section style={style} className={styles.Container}>
			<div className={styles.FormContainer}>
				<h2 className={styles.Title}>Payment Channel</h2>
				<Form.Label className={styles.Label}>Who are you?</Form.Label>
				<Form.Select size="lg" value={type} name="type" onChange={handleSelect}>
					<option value="1">I'm buying</option>
					<option value="2">I'm selling</option>
				</Form.Select>

				<Form.Label className={styles.Label2}>I want to:</Form.Label>
				<Form.Select
					size="lg"
					value={typeTx}
					name="typeTx"
					onChange={handleSelectTx}
				>
					<option value="1">Create a new payment channel</option>
					<option value="2">Verify a new payment channel state</option>
					<option value="3">Sign a new payment channel state</option>
					<option value="4">Close the channel</option>
				</Form.Select>

				<br />

				<div className={styles.GroupContainer}>
					<Form>
						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>My Public Key</Form.Label>
								<p className={styles.Label}>{myShortPublicKey}</p>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>His Address</Form.Label>
								<p className={styles.Label}>{hisShortPublicKey}</p>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>My Balance</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={20}
									onChange={handleChange}
									value={myBalance}
									name="myBalance"
									type="number"
									placeholder="0"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>His Balance</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={20}
									onChange={handleChange}
									value={hisBalance}
									name="hisBalance"
									type="number"
									placeholder="0"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>My seqno</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={20}
									onChange={handleChange}
									value={mySeqno}
									name="mySeqno"
									type="number"
									placeholder="0"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>His seqno</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={20}
									onChange={handleChange}
									value={hisSeqno}
									name="hisSeqno"
									type="number"
									placeholder="0"
								/>
							</Form.Group>
						</div>

						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>Signature </Form.Label>
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
						<div className={styles.Group}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label className={styles.Label}>Channel Number</Form.Label>
								<Form.Control
									className={styles.Form}
									maxLength={256}
									onChange={handleChange}
									value={channelNumber}
									name="channelNumber"
									type="text"
									placeholder="Signature"
								/>
							</Form.Group>
						</div>
					</Form>
				</div>
			</div>
			<div className={styles.Container_Buttons}>
				<Button_Action
					text="Send"
					onClick={() => {
						const isBuyer = type == '1' ? true : false;
						const args = {
							myPublicKey,
							hisPublicKey,
							myBalance,
							hisBalance,
							mySeqno,
							hisSeqno,
							isBuyer,
							channelNumber,
							signature,
						};
						switch (data.typeTx) {
							case '1': {
								dispatch(createPaymentChannel(args));
								Store.addNotification({
									title: 'Channel created!',
									message:
										'The was correctly created, enjoy the future of payments today!',
									type: 'success',
									insert: 'top',
									container: 'top-right',
									animationIn: ['animate__animated', 'animate__fadeIn'],
									animationOut: ['animate__animated', 'animate__fadeOut'],
									dismiss: {
										duration: 10000,
										onScreen: true,
									},
									touchSlidingExit: {
										swipe: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
										fade: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
									},
								});
								break;
							}
							case '2': {
								dispatch(verifyState(args));
								Store.addNotification({
									title: 'Channel verified!',
									message: 'The signature its verified successfully',
									type: 'success',
									insert: 'top',
									container: 'top-right',
									animationIn: ['animate__animated', 'animate__fadeIn'],
									animationOut: ['animate__animated', 'animate__fadeOut'],
									dismiss: {
										duration: 10000,
										onScreen: true,
									},
									touchSlidingExit: {
										swipe: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
										fade: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
									},
								});

								break;
							}
							case '3': {
								dispatch(updateChannel(args));
								Store.addNotification({
									title: 'Channel updated!',
									message: 'The channel its updated',
									type: 'success',
									insert: 'top',
									container: 'top-right',
									animationIn: ['animate__animated', 'animate__fadeIn'],
									animationOut: ['animate__animated', 'animate__fadeOut'],
									dismiss: {
										duration: 10000,
										onScreen: true,
									},
									touchSlidingExit: {
										swipe: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
										fade: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
									},
								});
								break;
							}
							case '4': {
								dispatch(closeChannel(args));
								Store.addNotification({
									title: 'Channel closed!',
									message: 'The channel its closed',
									type: 'success',
									insert: 'top',
									container: 'top-right',
									animationIn: ['animate__animated', 'animate__fadeIn'],
									animationOut: ['animate__animated', 'animate__fadeOut'],
									dismiss: {
										duration: 10000,
										onScreen: true,
									},
									touchSlidingExit: {
										swipe: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
										fade: {
											duration: 400,
											timingFunction: 'ease-out',
											delay: 0,
										},
									},
								});
								break;
							}
						}
					}}
				/>
			</div>
		</section>
	);
};

export default PaymentChannel;
