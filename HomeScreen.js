import React, { useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { Text, View, Button, StyleSheet, Image, Dimensions} from 'react-native';
import { ProductHandler } from './ProductHandler.js'

import { FullResultsComponent } from './FullResultsComponent.js';
import { BarcodeScannerComponent } from './BarcodeScannerComponent.js';
import { MessageComponent } from './MessageComponent.js';

import BottomSheet from '@gorhom/bottom-sheet';

//route, navigation }
class HomeScreen extends React.Component  {

  constructor(props)
  {
    console.log("Home: run constructor")

    super(props)
    this.state = {
      allowScanning: true,
      results: {
        status: "init",
        product: null
      },
      isResultsExpanded: false,
    }
    this.ph = new ProductHandler()

    this.handleBarCode = this.handleBarCode.bind(this)
    this.getMessageText = this.getMessageText.bind(this)
    this.handleSheetChanges = this.handleSheetChanges.bind(this)
    


    //For bottom sheet
    //this.sheetRef = useRef(null);
    //this.snapPoints = useMemo(() => {return results.status==='ok'? [240,"90%"]: [240]});
  }

  

  // useMemo(() => {
  //   this.snapPoints = results.status==='ok'? [240,"90%"]: [240]
  // }, []);


  //console.log("Home: start, allow scanning:", allowScanning)
  // const ph = new ProductHandler()
  
  //const[results, setResults] = useState({status: "init", product: null})

  //const [allowScanning, setAllowScanning] = useState(true);

  handleBarCode = async (bc) => {
    console.log('Home: Handle barcode:', bc)

    console.log('Home: handleBarCode: allow scanning?:', this.state.allowScanning)
    console.log('Home: handleBarCode: is results expanded?:', this.state.isResultsExpanded)

    
    

    console.log("Home: stop allowing scanning")
    //setAllowScanning(false)
    this.setState({allowScanning: false})

    if(this.state.isResultsExpanded)//if results are up then abandon
    {
      console.log('Home: handleBarCode: abandoning as results are up?')
    }
    else if(bc === this.state.results.product?.barcode)
    {
      console.log("Home: same barcode detected, skipping fetch")
    }
    else
    {
      console.log("Home: barcode fetch:",bc)
      const p = await this.ph.FetchProduct(bc)
      //setResults(p)
      this.setState({results: p})
    }
    
    console.log("Home: allow scanning in 3 secs")
    // setTimeout(() => { setAllowScanning(true); }, 3000)
    setTimeout(() => { this.setState({allowScanning: true}); }, 3000)
  }

  getMessageText = () =>
  {
    switch (this.state.results.status) {
      case "init":
        return "Scan a product barcode to start"
      case "error":
        return "There was a problem looking up this product, try again"
      case "notFound":
        return "Product not found"
      case "incomplete":
        return "We couldn't find enough information about this product"
      default:
        return "";
    }
  }




  //DOESN'T WORK
  // callbacks
  handleSheetChanges = (index) => {
    console.log('Home: handleSheetChanges', index)

    //if maximising results stop scanning
    if(index === 1)
    {
      this.setState({isResultsExpanded: true})
    }
    else
    {
      this.setState({isResultsExpanded: false})
    }
      
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <BottomSheet
          ref={null}
          index={0}
          onChange={this.handleSheetChanges}
          snapPoints={this.state.results.status==='ok'? [240,"90%"]: [240]}
          handleIndicatorStyle={!this.state.results.product && {opacity: 0, height: 0}}//only show resize handle if can resize
          backdropComponent={()=>
            <View style={StyleSheet.absoluteFillObject}>
              <BarcodeScannerComponent onBarCodeScanned ={this.state.allowScanning? this.handleBarCode : undefined} allowScanning ={this.state.allowScanning}/>
            </View>
          }
        >
          {this.state.results.status !== 'ok' && <MessageComponent messageText={this.getMessageText()}  style={StyleSheet.absoluteFillObject}/>}
          {this.state.results.product && <FullResultsComponent product={this.state.results.product}/>}
        </BottomSheet>
      </View>
    )
  }
  

}
export default HomeScreen

/*


      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={useMemo(() => ['25%', '40%'], [])}
        onChange={handleSheetChanges}
        backdropComponent={()=>
          <View style={StyleSheet.absoluteFillObject}>
            <BarcodeScannerComponent onBarCodeScanned ={handleBarCode} allowScanning ={allowScanning}/>
          </View>
        }
      >
        
          <FullResultsScreen product={pro}/>
      
      </BottomSheet>



---
<View elevation={0} style={[styles.results_summary_container  ]}>
</View>
----
    <View style={styles.container}>

    </View>
      <View elevation={0} style={[styles.results_summary_container  ]}>
          {product && <ResultsSummaryComponent product={product}/>}
      </View>

    <View style={styles.container}>
      <FullResultsScreen product={product}/>
    </View>
*/

const styles = StyleSheet.create({

  results_summary_container:{
    //position: "absolute",
    flex:1,
    //bottom:0,
    height: 200,
    width: "100%",
  },


  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
});
