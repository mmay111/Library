/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    config.pasteFromWordRemoveFontStyles = false;
    config.pasteFromWordCleanupFile = false;
    config.pasteFromWordPromptCleanup = false;
    config.pasteFromWordNumberedHeadingToList = false;
    config.defaultLanguage = 'tr';
    config.language = 'tr';
    config.entities  = false
config.basicEntities = false;
config.entities_greek = false;
config.entities_latin = false;
    //    CKEDITOR.config.pasteFromWordCleanupFile=false;
    //    CKEDITOR.config.pasteFromWordPromptCleanup
    //    Starting from version 4.6 of CKEditor the following options were deprecated:

    //    CKEDITOR.config.pasteFromWordRemoveFontStyles (deprecated in favor of Advanced Content Filter)
    //For CKEditor versions older than 4.6 the following options were available, too:

    //    CKEDITOR.config.pasteFromWordNumberedHeadingToList
    //    CKEDITOR.config.pasteFromWordRemoveStyles
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    //config.language = 'en';
    //config.toolbar = "mini";
    //config.removePlugins = 'image,table,tabletools,link,elementspath,save,font,elementspath,contextmenu,liststyle,tabletools,tableselection';
    //config.disableNativeSpellChecker = true;

};

