import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { dollarSignWithDecimal } from "../../action/numberFormat";
import Select from 'react-select';
import { sellStock } from "../../action/services";

import '../../css/Submit.css';

class Sell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      submitted: false,
      title: 'Sell Stock',
      errors: {},
      invalid: false
    }
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ showForm: nextProps.showForm })
  }

  init = () => {
    this.setState({
      title: 'Sell Stock',
      submitted: false,
      showForm: false,
      errors: {},
      invalid: false,
      selectedOption: null,
      result: {},
      maxSell: 0
    });
  };

  setError = (field, value) => {
    let errors = {};
    errors[field] = value;
    this.setState({
      errors,
      invalid: true
    })
  };

  removeError = () => {
    this.setState({
      errors: {},
      invalid: false
    })
  };

  handleClose = (e) => {
    e.preventDefault();
    this.init();
    this.props.handleClose();
  };

  handleValidation = (ticker, shares) => {
    if(ticker === '') {
      this.setError('ticker', 'This field is required');
    } else {
      if(shares === '') {
        this.setError('shares', 'This field is required');
      } else {
        if(shares <= 0) {
          this.setError('shares', 'This field should be greater than 0');
        }
      }
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.removeError();
    const id = localStorage.getItem('uuid');
    const ticker = (this.state.selectedOption !== null)?this.state.selectedOption.value: '';
    const shares = parseInt(this.refs.shares.value);

    await this.handleValidation(ticker, shares);
    if(!this.state.invalid) {
      sellStock({account_id: id, ticker: ticker, shares: shares})
          .then((res = {}) => {
            if(res.hasOwnProperty('status') && res.status !== 'complete') {
              alert(res.status);
            } else {
              this.removeError();
              this.props.handleDataUpdate();
              this.setState({
                title: (res.hasOwnProperty('status'))?'Congratulations':'Error',
                submitted: true,
                result: { ticker, shares }
              });
            }
          })
    }
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption, maxSell: selectedOption.shares })
  };

  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleDataUpdate: PropTypes.func.isRequired,
    tickerList: PropTypes.array.isRequired
  };

  render() {
    const formEle = (errors, selectedOption, tickerList, maxSell) => {
      return (
          <Fragment>
            <form onSubmit={ this.handleSubmit }>
              <div className="col-sm-10 col-sm-offset-1">
                <div className={ `form-group one-line ${ (errors.ticker)?'has-error':null }` }>
                  <label className="text f18 text-normal text-gray">Ticker:&nbsp;</label>
                  <Select value={ selectedOption } onChange={ this.handleChange } options={ tickerList }/>
                </div>
                <div className={ `form-group one-line ${ (errors.shares)?'has-error':null }` }>
                  <label htmlFor="" className="control-label text f18 text-normal text-gray">Number of Shares:&nbsp;</label>
                  <input type="number" className="form-control" min="0" max={ maxSell } ref="shares" defaultValue="0" onFocus={ e => e.target.select() }/>
                  <div className="clearfix">&nbsp;</div>
                  { errors && <span className='form-text text-danger'>{ errors.shares }<br/>{ errors.ticker }</span> }
                </div>
              </div>
              <div className="divider h-40">&nbsp;</div>
              <div className="btn-wrap right">
                <button className="btn btn-outline-app" onClick={ this.handleClose }>Close</button>
                <button className="btn btn-app">Sell</button>
              </div>
            </form>
          </Fragment>

      );
    };

    const resultEle = (ticker = 'N/A', shares = 0, total) => {
      return(
          <Fragment>
            <div className="col-sm-10 col-sm-offset-1">
              <p className="text f18 text-normal text-gray">
                You have successfully sold
                <span className="text f18 text-normal text-app">&nbsp;{ ticker }</span>.<br/><br/>
                Number of shares:
                <span className="text f18 text-normal text-app">&nbsp;{ shares }</span><br/>
                { total && <Fragment>Total Price:</Fragment> }
                { total && <span className="text f18 text-normal text-app">&nbsp;{ dollarSignWithDecimal(total, 2)}</span> }
              </p>
            </div>
            <div className="divider h-40">&nbsp;</div>
            <div className="btn-wrap right">
              <button className="btn btn-app" onClick={ this.handleClose }>Close</button>
            </div>
          </Fragment>

      )
    };
    const { showForm, title, submitted, errors, selectedOption, result, maxSell } = this.state;
    const { tickerList } = this.props;
    return (
        <div className={ `mask ${(showForm)? 'show': 'hide'}` }>
          <div className="form-wrap col-sm-6 col-sm-offset-3">
            <div className="header">
              <h3 className="text f36 text-semi text-app title">{ title }</h3>
              <button type="button" className="close float-right text f36" aria-label="Close" onClick={ this.handleClose }>
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="divider hb-40">&nbsp;</div>
            </div>
            <div className="clearfix">&nbsp;</div>
            { (showForm) &&
            ((submitted)?
                    resultEle(result.ticker, result.shares) :
                    formEle(errors, selectedOption, tickerList, maxSell)
            ) }
          </div>
        </div>
    );
  }
}

export default Sell;