import React from 'react';

export const NavigationContext = React.createContext({});

export const useNavigation = () => React.useContext(NavigationContext);

interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavigationProviderState {
  pathname: string;
  navigate: any;
}

export default class NavigationProvider extends React.Component<
  NavigationProviderProps,
  NavigationProviderState
> {
  constructor(props) {
    super(props);

    this.state = {
      pathname: window.location.pathname,
      navigate: this.navigate
    };
  }

  navigate = (pathname) => {
    this.setState({ pathname });
    window.history.replaceState(null, '', pathname);
  };

  render() {
    const { pathname, navigate } = this.state;
    const { children } = this.props;
    console.log('stat/pathname: ', pathname);
    return (
      <NavigationContext.Provider value={{ pathname, navigate }}>
        {children}
      </NavigationContext.Provider>
    );
  }
}
