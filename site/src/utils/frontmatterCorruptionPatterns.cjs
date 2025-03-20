
// Patterns that indicate YAML corruption with prevention and correction info
const CORRUPTION_PATTERNS = [


  // Any quote characters surrounding a URL
  // Remove any quotes found on on either side of a URL
  {
    pattern: 
    messageToLog: '',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs', 'trackVideosInRegistry.cjs'],
    correctionFunction: 'removeAnyQuoteCharactersfromEitherOrBothSidesOfURL',
    isCritical: true
  },

  // Block scalar syntax found in property
  // Remove block scalar syntax, and assure one single string
  { 
    pattern: 
    messageToLog: 'Block scalar syntax found in property',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'attemptToFixBlockScalar',
    isCritical: true
  },
   
  // Unquoted error message properties (critical)
  // Surround the error message property with double mark quotes
  {
    pattern: 
    messageToLog: 'Contains unquoted error message property',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'surroundErrorMessagePropertyWithQuotes',
    isCritical: true
  },
      // Unbalanced quotes (critical)
      {
        pattern: 
        messageToLog: 'Contains unbalanced quotes in value',
        preventsOperations: ['assureYAMLPropertiesCorrect.cjs', 'fetchOpenGraphData.cjs'],
        correctionFunction: 'attemptToFixUnbalancedQuotes',
        isCritical: true
      },
  
  // More than one instance of the same key
  // Delete all instances of the key, further scripting will add the key back in with the correct value
  { 
    pattern: 
    messageToLog: 'Duplicate keys in frontmatter',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'deleteAllInstancesOfKey',
    isCritical: true
  },
  
  // Improper use of single mark quotes
  // Remove the single mark quotes and add double mark quotes
  { 
    pattern:  
    messageToLog: 'Error message with single mark quotes',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'replaceSingleMarkQuotesWithDoubleMarkQuotes',
    isCritical: true
  },

  // Improper character set surrounding error message (like "\"'HTTP error!'\""
  // Remove the improper character set and add double mark quotes
  {
    pattern: 
    messageToLog: 'Error message with improperly formatted character set',
    preventsOperations: ['assureYAMLPropertiesCorrect.cjs'],
    correctionFunction: 'removeImproperCharacterSetThenAddDoubleMarkQuotes',
    isCritical: true
  },
    // URLs broken across multiple lines
  // Replace the broken url with the intended url as one continguous sting with no surrounding quotes
  { 
    pattern: /^([\w-]+):[ \t]*https?:[ \t]*$/m, 
    messageToLog: 'URL split across multiple lines',
    preventsOperations: ['fetchOpenGraphData.cjs'],
    correctionFunction: 'attemptToFixBrokenUrl',
    isCritical: true
  },
  
  // Missing URL property not found within a directory not found in the excludeUrlCheck array
  // No corection, just a message to log.
  {
    pattern: 
    messageToLog: 'Missing URL property needed for OpenGraph',
    preventsOperations: ['fetchOpenGraphData.cjs'],
    correctionFunction: addFileNameToMissingUrlList
    isCritical: false
  },
  
];
```