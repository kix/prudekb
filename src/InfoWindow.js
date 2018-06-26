import React, {PureComponent} from 'react';

export default class InfoWindow extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.title}`;

    return (
      <div>
        {displayName}
        <img width={240} src={info.image} />
      </div>
    );
  }
}