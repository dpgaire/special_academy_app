import { NavigationContainerRef } from '@react-navigation/native';

let navigator: NavigationContainerRef<any> | null = null;

export const setNavigator = (nav: NavigationContainerRef<any>) => {
  navigator = nav;
};

export const navigate = (routeName: string, params?: object) => {
  if (navigator) {
    navigator.navigate(routeName, params);
  }
};
