// @flow
import React, {Component} from 'react';
import './App.css';

import cx from 'classnames';

const secondaryList = {
  body: ['leg', 'head', 'ear', 'face', 'arm'],
  activities: [
    'to go for a walk',
    'to go to the bathroom',
    'to go for a drive',
    'a nap',
    'to call',
    'to watch TV',
    'a massage',
    'to listen music',
    'to look at picture',
    'brush my hair',
    'to go to my chair',
    'to go to the couch',
    'to go to the bed',
    'it quiet',
  ],

  stuff: ['my phone', 'my iPad', 'my glasses'],

  music: ['Moody Blues', 'The Beatles'],

  shows: [
    'HGTV',
    'Fixer Upper',
    'Property Brothers',
    'Days of Our Lives',
    'Turner Classic Movies',
    'Christmas Movie',
    'A game show',
    'Romance Movie',
    'Comedy',
    'Action',
    'Drama',
  ],

  people: [
    'Brenda',
    'Diane',
    'Dylan',
    'Harlan',
    'Holly',
    'Jimbo',
    'Jimmy',
    'Kim',
    'Larry',
    'Rex',
    'Shali',
    'Vicky',
  ],

  feelings: ['happy 😄', 'sad ☹️', 'sleepy', 'hungry'],
  clothing: ['shirt', 'pants', 'underwear', 'socks'],
  food: [
    'tuna',
    'turkey',
    'sandwich',
    'fruit',
    'bananas',
    'salad',
    'vegetables',
    'salt',
    'pepper',
    'dessert',
    'eggs',
  ],
  drink: [
    'water',
    'tea',
    'orange juice',
    'pomegranite juice',
    'milk',
    'coffee',
  ],
};

const primaryList = [
  {
    text: 'I want',
    allows: [
      secondaryList.drink,
      secondaryList.stuff,
      secondaryList.food,
      secondaryList.clothing,
    ],
  },
  {
    text: 'I want to talk to',
    allows: [secondaryList.people],
  },
  {
    text: 'I want to watch',
    allows: [secondaryList.shows],
  },
  {
    text: 'I want to listen to',
    allows: [secondaryList.music],
  },
  {
    text: "I don't want",
    allows: [secondaryList.food],
  },
  {
    text: 'I am',
    allows: [secondaryList.feelings],
  },
  {
    text: 'Where is',
    allows: [secondaryList.people, secondaryList.stuff],
  },
  {
    text: 'I feel pain on my',
    allows: [secondaryList.body],
  },
];

class App extends Component<
  {},
  {
    primarySelection: Object | void,
    secondaryText: string | void,
  },
> {
  state = {
    primarySelection: undefined,
    secondaryText: undefined,
  };

  render() {
    const {primarySelection, secondaryText} = this.state;

    return (
      <div className="App">
        {primarySelection != null && (
          <h1>
            {primarySelection.text} {secondaryText}
          </h1>
        )}
        <div className="Container">
          <div>
            {primaryList.map(item => (
              <div
                className={cx('App--item', {
                  selected: primarySelection === item,
                })}
                onClick={() => {
                  this.setState({
                    secondaryText: undefined,
                    primarySelection:
                      primarySelection === item ? undefined : item,
                  });
                }}>
                {item.text}
              </div>
            ))}
          </div>

          {primarySelection != null && (
            <div>
              {primarySelection.allows
                .reduce((accum, curr) => {
                  return [...accum, ...curr];
                }, [])
                .map(item => (
                  <div
                    className={cx('App--item', {
                      selected: secondaryText === item,
                    })}
                    onClick={() => {
                      this.setState({
                        secondaryText:
                          secondaryText === item ? undefined : item,
                      });
                      // argh
                    }}>
                    {item}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default App;
