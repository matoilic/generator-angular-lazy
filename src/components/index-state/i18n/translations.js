import angular from 'angular';
import 'angular-translate';
import de from './de';
import en from './en';
import it from './it';

const dependencies = [
    'pascalprecht.translate'
];

export default angular
    .module('index-state-component-translations', dependencies)
    .config(de)
    .config(en)
    .config(it);
