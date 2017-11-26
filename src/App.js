// @flow
import React, {Component} from 'react';

import './App.css';

import cx from 'classnames';

const secondaryList = {
  shows: [
    {image: require('./images/hgtv.png'), text: 'HGTV'},
    // {image: require('./images/fixer-upper.png'), text: 'Fixer Upper'},
    // {image: require('./images/property-brothers.png'), text: 'Property Brothers'},
    {
      image: require('./images/days-of-our-lives.png'),
      text: 'Days of Our Lives',
    },
    // {
    //   image: require('./images/turner-classic-movies.png'),
    //   text: 'Turner Classic Movies',
    // },
    {image: require('./images/christmas-movie.png'), text: 'a Christmas movie'},
    // {image: require('./images/game-show.png'), text: 'a game show'},
    // {image: require('./images/romance.png'), text: 'a romance'},
    // {image: require('./images/comedy.png'), text: 'a comedy'},
    // {image: require('./images/action.png'), text: 'a action'},
    // {image: require('./images/drama.png'), text: 'a drama'},
  ],
  people: [
    {image: require('./images/dylan.png'), text: 'Dylan'},
    {image: require('./images/harlan.png'), text: 'Harlan'},
    {image: require('./images/holly.png'), text: 'Holly'},
    {image: require('./images/kimmy.png'), text: 'Kim'},
    {image: require('./images/larry.png'), text: 'Larry'},
    {image: require('./images/shali.png'), text: 'Shali'},
  ],
  food: [
    // {image: require('./images/orange-juice.png'), text: 'tuna'},
    {image: require('./images/turkey.png'), text: 'turkey'},
    {image: require('./images/sandwich.png'), text: 'sandwich'},
    {image: require('./images/fruit.png'), text: 'fruit'},
    // {image: require('./images/bananas.png'), text: 'bananas'},
    {image: require('./images/salad.png'), text: 'salad'},
    // {image: require('./images/vegetables.png'), text: 'vegetables'},
    {image: require('./images/dessert.png'), text: 'dessert'},
    // {image: require('./images/eggs.png'), text: 'eggs'},
  ],
  drink: [
    // {image: require('./images/orange-juice.png'), text: 'water'},
    {image: require('./images/tea.png'), text: 'tea'},
    {image: require('./images/orange-juice.png'), text: 'orange juice'},
    // {image: require('./images/pomegranite-juice.png'), text: 'pomegranite juice'},
    {image: require('./images/milk.png'), text: 'milk'},
    {image: require('./images/coffee.png'), text: 'coffee'},
  ],
};
const primaryList = [
  {
    image: secondaryList.shows[0].image,
    text: 'Watch',
    allows: [secondaryList.shows],
  },
  {
    image: secondaryList.drink[0].image,
    text: 'Drink',
    allows: [secondaryList.drink],
  },
  {
    image: secondaryList.food[0].image,
    text: 'Eat',
    allows: [secondaryList.food],
  },
  {
    image: secondaryList.people[0].image,
    text: 'People',
    allows: [secondaryList.people],
  },
];
class App extends Component<
  {},
  {
    primarySelection: Object | void,
    secondarySelection: Object | void,
  },
> {
  state = {
    primarySelection: undefined,
    secondarySelection: undefined,
  };
  render() {
    const {primarySelection, secondarySelection} = this.state;

    return (
      <div className="App">
        {primarySelection != null && (
          <div
            className="App--top"
            onClick={() => {
              if (secondarySelection != null) {
                this.setState({
                  secondarySelection: undefined,
                });
              } else {
                this.setState({
                  primarySelection: undefined,
                });
              }
            }}>
            <span aria-label="Back" role="img">
              ⏪
            </span>
          </div>
        )}
        <div className="Container">
          {primarySelection == null && (
            <div>
              {primaryList.map(item => (
                <div
                  className={cx('App--item', {
                    selected: primarySelection === item,
                  })}
                  onClick={() => {
                    this.setState({
                      secondarySelection: undefined,
                      primarySelection:
                        primarySelection === item ? undefined : item,
                    });
                  }}>
                  <img alt={item.text} src={item.image} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {primarySelection != null &&
            secondarySelection == null && (
              <div>
                {primarySelection.allows
                  .reduce((accum, curr) => {
                    return [...accum, ...curr];
                  }, [])
                  .map(item => (
                    <div
                      className={cx('App--item', {
                        selected: secondarySelection === item,
                      })}
                      onClick={() => {
                        this.setState({
                          secondarySelection:
                            secondarySelection === item ? undefined : item,
                        });
                        // argh
                      }}>
                      <img alt={item.text} src={item.image} />
                      <span>{item.text}</span>
                    </div>
                  ))}
              </div>
            )}

          {primarySelection != null &&
            secondarySelection != null && (
              <div>
                <p>
                  {primarySelection.text} {secondarySelection.text}
                  <button
                    type="button"
                    onClick={() => {
                      const synth = window.speechSynthesis;
                      const utterThis = new window.SpeechSynthesisUtterance(
                        `${primarySelection.text} ${secondarySelection.text}`,
                      );
                      const coolVoice = synth
                        .getVoices()
                        .find(
                          item => item.voiceURI === 'Google UK English Female',
                        );
                      if (coolVoice != null) {
                        utterThis.voice = coolVoice;
                      }
                      synth.speak(utterThis);

                      // googleTTS('Hello World', 'en', 1).then(function(url) {
                      //   alert(url);
                      // });
                    }}>
                    <span role="img" aria-label="Speak">
                      💬
                    </span>
                  </button>
                  <img
                    alt={secondarySelection.text}
                    src={secondarySelection.image}
                  />
                </p>
              </div>
            )}
        </div>
      </div>
    );
  }
}
export default App;
