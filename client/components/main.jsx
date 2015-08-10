//For webpack, require react components here
var Nav = require('./nav.jsx');
var User = require('./user.jsx');
var Activities = require('./activities.jsx');
var AdSpace = require('./adspace.jsx');
var Footer = require('./footer.jsx');
var Create = require('./createActivity.jsx');
var ToggleForm = require('./toggleForm.jsx');

module.exports = React.createClass({
  displayName : 'Main',
  render: function(){
    //Need to get data from db here
    var activityArray = [
      { id: 1, avatar: "//placehold.it/80x80&text=[img]", user: "Bob Bob", description: "Now, look here, my good man. Where'd you get the coconuts? No, no, no! Yes, yes. A bit. But she's got a wart."},
      { id: 2, avatar: "//placehold.it/80x80&text=[img]", user: "Jim Jim", description: "Found them? In Mercia?! The coconut's tropical! Well, she turned me into a newt. And the hat. She's a witch!"},
      { id: 3, avatar: "//placehold.it/80x80&text=[img]", user: "Jill Jill", description: "A newt? Why do you think that she is a witch? What a strange person. You don't vote for kings. Did you dress her up like this? Well, I didn't vote for you. What do you mean? No, no, no! Yes, yes. A bit. But she's got a wart. Bring her forward! No, no, no! Yes, yes. A bit. But she's got a wart."},
      { id: 4, avatar: "//placehold.it/80x80&text=[img]", user: "Ted Ted", description: "Well, Mercia's a temperate zone! You don't frighten us, English pig-dogs! Go and boil your bottoms, sons of a silly person! I blow my nose at you, so-called Ah-thoor Keeng, you and all your silly English K-n-n-n-n-n-n-n-niggits! You don't vote for kings. Ah, now we see the violence inherent in the system! She looks like one."}
    ];

    return (
      <div>
        <Nav />
       
        <div className="row">
          <div className="large-3 columns ">
            <User />
          </div>
           
          <div className="large-6 columns">
            {/*load add activity here using toggle; 
            add and remove class hitting a button*/}
            <Activities activities={activityArray} />
          </div>  

          <aside className="large-3 columns hide-for-small">
          {/*Placeholder button */}
            <ToggleForm />
            <AdSpace />
          </aside>
        </div>
      
        <Footer />
      </div>
    )
  }
});

// React.render(<Main />, document.getElementsByTagName('Main')[0]);