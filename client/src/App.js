import React from 'react';
import Calendar from './components/Calendar/Calendar';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import classes from './App.module.css';

const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className={classes.App}>
        <Calendar />  
      </div>
    </ApolloProvider>
  );
}

export default App;
