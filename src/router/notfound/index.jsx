import React, { Component }  from 'react';

class NotFound extends Component {
  constructor(props){
    super(props);
    this.state={error: 404}
  }
  render() {
    return (
      <div>
        <h1>404 Page Not Found ! </h1>
      </div>
    );
  }
}

export default NotFound;