import React, { Component } from 'react';

import ChainAbstractionLayer from 'chainabstractionlayer';

import liqualityUi from 'liquality-ui';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import './App.css';

const { BlockExplorer } = liqualityUi;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chainId: 'ethereum',
      blockNumber: 1,
      block: null,
      transactions: null,
      selectedTransaction: null,
    };
    this.chains = {
      ethereum: new ChainAbstractionLayer('ethereum://auth@localhost:8545/'),
      bitcoin: new ChainAbstractionLayer('bitcoin://bitcoin:local321@localhost:18332/?timeout=200&version=0.16.0'),
    };
    this.chain = this.chains.ethereum;
  }

  handleChainChange(e) {
    const chainId = e.target.value;
    this.setState(Object.assign({}, this.state, { chainId }));
    this.chain = this.chains[chainId];
  }

  handleBlockNumberChange(e) {
    this.setState(Object.assign({}, this.state, { blockNumber: e.target.value }));
  }

  handleTransactionClicked(transaction) {
    this.setState(Object.assign({}, this.state, { selectedTransaction: transaction }));
  }

  async handleConfirm(e) {
    const blockData = await this.chain.getBlockByNumber(this.state.blockNumber, false);
    const transactionCalls = blockData.transactions.map(tx => this.chain.getTransactionByHash(tx));
    const transactions = await Promise.all(transactionCalls);
    this.setState(Object.assign({}, this.state.block, {
      block: blockData,
      transactions,
      selectedTransaction: null
    }));
  }
  render() {
    return (
      <Grid container spacing={16} className="App">
        <Grid item xs={12}>
          <Grid container spacing={16}>
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">Chain</FormLabel>
                <RadioGroup row
                  aria-label="chain"
                  name="chain"
                  value={this.state.chainId}
                  onChange={this.handleChainChange.bind(this)}
                >
                  <FormControlLabel value="bitcoin" control={<Radio />} label="Bitcoin" />
                  <FormControlLabel value="ethereum" control={<Radio />} label="Ethereum" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="block-number">Block #</InputLabel>
                <Input id="block-number" value={this.state.blockNumber} onChange={this.handleBlockNumberChange.bind(this)} />
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={this.handleConfirm.bind(this)}>Go</Button>
            </Grid>
          </Grid>
        </Grid>
        <BlockExplorer
          block={this.state.block}
          transactions={this.state.transactions}
          selectedTransaction={this.state.selectedTransaction}
          onTransactionClick={this.handleTransactionClicked.bind(this)} />
      </Grid>
    );
  }
}

export default App;
