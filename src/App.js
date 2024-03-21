import { Table, TableCell, TableContainer, TableHead, TableRow, TextField, TableBody, Paper, Box, Typography, Button } from "@mui/material";
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { useEffect, useState } from "react";

function App() {

  const [ rowData, setRowData ] = useState([]);
  const [ ipAddress,setIpAddress ] = useState('');
  const [ filterString, setFilterString ] = useState('');
  const [ products, setProducts ] = useState([])
  const [ selectedProduct, setSelectedProduct] = useState(null)

  const handleRefresh = async(e) => {
      if (filterString.startsWith(':IP:') && filterString.endsWith(':IP:')) {
        let ip = filterString.replace(":IP:", "").replace(":IP:","");
        localStorage.setItem('ipAddress', ip)
        setIpAddress(ip);
        alert(`IP set to : ${ip}`)
        return;
      } 
      try {
        const response = await fetch( `http://${ipAddress}:7000/priceList` , {
          method: "get"
        });
        const body = await response.json();
        localStorage.setItem('products',JSON.stringify(body));
        setRowData(body);
        alert('Refreshed!!')
      } catch (error) {
        console.log(error);
        alert('Error in fetching data : ', error);
      }
  }

  useEffect(()=>{
    setRowData(JSON.parse(localStorage.getItem('products')) || []);
    setIpAddress(localStorage.getItem('ipAddress') || ipAddress);
  },[])

  useEffect(()=>{
    filterString.length > 2 && setProducts(Object.keys(rowData).filter(productName => productName.includes(filterString)))
  },[filterString])

  useEffect(()=>{
    selectedProduct == null ? setProducts(Object.keys(rowData)) : setProducts( Object.keys(rowData).filter(product => product === selectedProduct));
  },[selectedProduct])

  useEffect(()=>{
    setProducts(Object.keys(rowData))
  },[rowData])



  return (
    selectedProduct ? 
    <>
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: 'center', minWidth: '100%'}}>
        <KeyboardBackspaceOutlinedIcon sx={{paddingRight: '10px'}} onClick={()=>setSelectedProduct(null)} fontSize="large"/>
        <Typography sx={{width: '80%'}} value={selectedProduct}/>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Supplier Name</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">CP</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rowData[selectedProduct].map((product,index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell >{product.supName}</TableCell>
                <TableCell align="right">{product.qty}</TableCell>
                <TableCell align="right">{product.cp}</TableCell>
                <TableCell align="center">{product.date}</TableCell>
              </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" sx={{paddingRight: '10px', width: '100%', marginTop:'25px' }} onClick={()=>setSelectedProduct(null)} fontSize="large" children={"BACK"}/>
    </>
    :
    <>
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: 'center', minWidth: '100%'}}>
        <TextField sx={{width: '80%'}} onChange={(e) => setFilterString(e.target.value.toUpperCase())}/>
        <CachedOutlinedIcon sx={{paddingRight: '10px'}} onClick={handleRefresh} fontSize="large">Refresh</CachedOutlinedIcon>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Total Qty</TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            products.map((productName) => (
                <TableRow
                  key={productName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell><b>{productName}</b></TableCell>
                  <TableCell align="right"> {rowData[productName][0]['totalQty']} </TableCell>
                  <TableCell><RemoveRedEyeIcon onClick={()=> setSelectedProduct(productName)}/></TableCell>
                </TableRow> 
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </>
    
    




  );
}

export default App;
