// theme.ts

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    
  },

 

  colors: {
    // Define your custom colors here
    primary: {
      50: '#fcfcfc',
      100: '#e3e3e3',
      200: '#cacaca'
      

      // ... add more color variants
    },

    secondary: {
      25: '#40a9dd',
      50: '#0894d4',
      
      100: '#1798d4',
      200: "#1e7898",
    },

    success:{
      25: "#40bc7c",
    },
    


    accent:{

    },
    myCustomScheme: {
      50: '#1798d4',
      100: '#1798d4',
      200: '#1798d4',
      // ... add more color variants for your custom scheme
    },

    
    // ... add more custom colors
  },
  
  
  
});

export default theme;
