var Create = require('./createActivity.jsx');
module.exports = React.createClass({
  displayName: 'ToggleForm',
  getInitialState: function(){
    return {
      showForm: false
    };
  },
  onClick: function(){
    this.setState({
      showForm: !this.state.showForm
    });
    console.log(this.state.showForm);
  },
  render: function(){
    return (
      <div>
        <button onClick={this.onClick}>{this.state.showForm ? 'Cancel' : 'Add an Activity'}</button>
        {this.state.showForm ? <Create /> : null}
      </div>
      );
  }
});