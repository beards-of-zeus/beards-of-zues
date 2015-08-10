module.exports = React.createClass({
  displayName: 'CreateActivity',
  render: function(){
    return (
        <div>
          <h3>Create Your Activity</h3>
          <form>
            <label>Title: </label><input type="text" name="title" />
            <label>Description: </label><textarea name="description" ></textarea>
            <label>Location: </label><input type="text" name="location" />
            <label>Keywords: </label><input type="text" name="keywords" />
            <button>Submit</button>
          </form>
        </div>
      );
  }
});