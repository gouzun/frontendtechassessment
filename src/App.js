import React, { useEffect,useState } from "react";
import { Center, Button, Box, Text } from "native-base";
import detectEthereumProvider from '@metamask/detect-provider';
function App() {

  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');

  let networkMap = new Map([
    [1, "ETHEREUM MAINNET"],
    [3, "ROPSTEN"],
    [4, "RINKEBY"],
    [5, "GOERLI"],
    [42, "KOVAN"]
  ]);

  let provider;

  const ConnectProvider = async () => {
    provider = await detectEthereumProvider();
  }

  ConnectProvider();

  const btnConnect = async () => {

    try {

      setStatus(<Text color="green.200">Connecting...</Text>);
      //to detect provider
      if (provider) {
        //to retrieve address
        const acc = await provider.request({ method: 'eth_requestAccounts' });
        if (acc.length > 0) {
          setAddress(acc[0]);
          setStatus(<Text color="green.500">Connected to </Text>);
          let networkName = networkMap.get(parseInt(provider.networkVersion));
          if(typeof networkName==='undefined'){
            networkName = "UNKNOWN NETWORK";
          }
          setNetwork(networkName);
        } else {
          setStatus(<Text color="red.500">Error: account not found.</Text>);
        }

      } else {
        setStatus(<Text color="red.500">Error: Please install metamask extension first.</Text>);
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    if (provider) {
      provider.on('chainChanged', () => {
        btnConnect();
      })
    }    
  }, [])

  return (
    <>
      <Center mt={10} flex={1} >
        <Text alignContent='center' fontSize={{
          base: "xl",
          lg: "4xl"
        }}>
          Simple page where user can click a button to connect to
        </Text>
        <Text color="emerald.500" fontSize={{
          base: "xl",
          lg: "4xl"
        }}> web3 wallet (metamask)</Text>


        <Box alignItems="center">
          <Button onPress={btnConnect}>Click to Connect</Button>
        </Box>
        {status}
        {network}
        <Box alignItems="center">
          {address ? <Text>Connected address : {address}.</Text> : <Text></Text>}
        </Box>

      </Center>
    </>
  );
}

export default App;
