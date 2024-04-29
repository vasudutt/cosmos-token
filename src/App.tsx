import { useCallback, useEffect, useMemo, useState } from 'react';
import TokenData from './data/response_1710751618660.json';
import './App.css';
import axios from 'axios';
import { IToken } from './types';

/* Celestia	9.56
Dymension	3.4
Injective	25.15
JUNO */

//let INTERVAL_ID = 0;

function App() {
	const [selectedToken, setSelectedToken] = useState<IToken>();

	const selectedNames = useMemo(() => {
		return ['Celestia', 'Dymension', 'Injective', 'JUNO'];
	}, []);
	const [filteredNames, setFilteredNames] = useState<IToken[]>();

	const callAPI = useCallback(async (ids: string[]) => {
		const response = await axios.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
				','
			)}&vs_currencies=usd`
		);

		return response.data;
	}, []);

	const filterNames = useCallback(async () => {
		const filteredData = TokenData.filter((token) => {
			return selectedNames.includes(token.name);
		});

		const priceList = await callAPI(
			filteredData.map((token) => token.id)
		);

		const filteredDataWithPrice = filteredData.map((token) => {
			console.log(priceList[token.id]);
			return {
				...token,
				price: priceList[token.id].usd,
			};
		});

		setFilteredNames(filteredDataWithPrice);
	}, [selectedNames, callAPI]);

	useEffect(() => {
		filterNames();
	}, [filterNames]);

	/* useEffect(() => {
		INTERVAL_ID = setInterval(async () => {
			if (!filteredNames || filteredNames?.length === 0) {
				return;
			}

			const priceList = await callAPI(
				filteredNames?.map((token) => token.id)
			);

			const filteredDataWithPrice = filteredNames?.map(
				(token) => {
					return {
						...token,
						price: priceList[token.id].usd,
					};
				}
			);

			setfilteredNames(filteredDataWithPrice);
		}, 10 * 1000);

		return () => {
			clearInterval(INTERVAL_ID);
		};
	}, [filteredNames, callAPI]); */

	return (
		<>
			<h1>Cosmos Tokens</h1>

			{selectedToken ? (
				<div className="token-details">
					<h2>{selectedToken.name} Details</h2>

					<div className="flex justify-between">
						<p className="font-bold">Symbol:</p>

						<p>{selectedToken.symbol}</p>
					</div>

					<div className="flex justify-between">
						<p className="font-bold">Price:</p>

						<p>{selectedToken.price}</p>
					</div>

					<button
						className="width-100"
						onClick={() => {
							setSelectedToken(undefined);
						}}
					>
						Back
					</button>
				</div>
			) : (
				<table>
					<thead>
						<tr>
							<td>Name</td>

							<td>Price</td>
						</tr>
					</thead>

					<tbody>
						{filteredNames?.map((token) => {
							return (
								<tr
									key={token.id}
									onClick={() => {
										setSelectedToken(token);
									}}
								>
									<td>{token.name}</td>
									<td>{token.price}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</>
	);
}

export default App;
