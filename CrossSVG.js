import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CrossSvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" {...props}>
    <Path d="M640 320 512 192 320 384 128 192 0 320l192 192L0 704l128 128 192-192 192 192 128-128-192-192 192-192z" stroke="white"/>
  </Svg>
)
export default CrossSvgComponent
