import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Catalog: undefined;
  Report: undefined;
  Setting: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  CustomerList: undefined;
  AddCustomer: undefined;
};
