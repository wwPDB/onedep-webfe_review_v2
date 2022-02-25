/*
 * File:  reviewCommon.js
 * Date:  10-July-2013  J. Westbrook
 *
 * Adapted from chemRefDataCommon.css so there may be unused methods -
 *
 * Updates:
 *  25-Dec-2013 jdw update for bs 3
 *  19-Mar-2014 jdw revise/simplify the sidebar navigation support code.
 *                  Fix menu highlighting
 *  15-Jun-2014 jdw add title/pdb_id in header -- 
 *   5-Jul-2104 jdw add filer & download options
 */
//
// Globals -
//
var sessionId = '';
var entryId = '';
var entryModelFileName = '';
var entrySfFileName = '';
var successFlag = 'false';
var errorFlag = '';
var errotText = '';
// 
var pagePath = '';
//
var reviewAdminOpsUrl      = '/service/review_v2/adminops';
var reviewIdOpsUrl         = '/service/review_v2/inline_idops';
var reviewFileOpsUrl       = '/service/review_v2/inline_fileops';
//



var newSessionServiceUrl     = '/service/review_v2/newsession';
var getSessionInfoServiceUrl = '/service/review_v2/getsessioninfo';

/*window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};*/

(function(){var b,d,c=this,a=c.console;c.log=b=function(){d.push(arguments);a&&a.log[a.firebug?"apply":"call"](a,Array.prototype.slice.call(arguments))};c.logargs=function(e){b(e,arguments.callee.caller.arguments)};b.history=d=[]})();
String.prototype.startsWith = function (str){
	return this.indexOf(str) == 0;
};

function logContext(message) {
    //console.log("%lc: " + message + " ( session id " + sessionId + " entry id " + entryId + " entry filename " + entryModelFileName + ")");
   // log("%lc: " + message + " ( session id " + sessionId + " entry id " + entryId + " entry model filename " + entryModelFileName +" entry sf filename " + entrySfFileName + ")");
  log("%log: " + message + " ( session id " + sessionId + ")");
}

function display_mol_star(molecule_url = 'undefined', em_volume_1_contourLevel = 1, em_mask_volume_1_contourLevel = 1, em_half_volume_1_contourLevel = 1, em_half_volume_2_contourLevel = 1,
                          em_additional_volume_1_contourLevel = 1,  em_volume_1_url = 'undefined', em_mask_volume_1_url = 'undefined', em_half_volume_1_url = 'undefined',
                          em_half_volume_2_url = 'undefined', em_additional_volume_1_url = 'undefined' , map_xray_1_url = 'undefined') {
    molstar.Viewer.create('myViewer', {
        extensions: [],
        layoutIsExpanded: true,
        layoutShowControls: true,
        layoutShowRemoteState: false,
        layoutShowSequence: true,
        layoutShowLog: true,
        layoutShowLeftPanel: false,

        viewportShowExpand: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
        volumeStreamingDisabled: false

    }).then(function (viewerInstance) {   // This could also be viewerInstance => {
        if (this.molecule_url !== 'undefined') {
            viewerInstance.loadAllModelsOrAssemblyFromUrl(molecule_url, 'mmcif', false, {representationParams: {theme: {globalName: 'operator-name'}}});
        }
        if (this.em_volume_1_contourLevel === 'undefined') {
            em_volume_1_contourLevel = 1
        }
        if (this.em_volume_1_url !== 'undefined') {
            viewerInstance.loadVolumeFromUrl(
                {
                    url: this.em_volume_1_url,
                    format: 'dscif',
                    isBinary: true
                },
                [{
                    type: 'absolute',
                    value: this.em_volume_1_contourLevel,
                    color: 0x0000ff,
                    alpha: 0.20
                }],
                {
                    isLazy: false,
                    entryId: 'primary'
                }
            );
        }
        if (this.em_mask_volume_1_url !== 'undefined') {
            viewerInstance.loadVolumeFromUrl(
                {
                    url: this.em_mask_volume_1_url,
                    format: 'dscif',
                    isBinary: true
                },
                [
                    {
                        type: 'absolute',
                        value: this.em_mask_volume_1_contourLevel,
                        color: 0xff0000,
                        alpha: 0.20
                    }
                ],
                {
                    isLazy: true,
                    entryId: 'mask'
                }
            );
        }

        if (this.em_half_volume_1_url !== 'undefined') {
            viewerInstance.loadVolumeFromUrl(
                {
                    url: this.em_half_volume_1_url,
                    format: 'dscif',
                    isBinary: true
                },
                [
                    {
                        type: 'absolute',
                        value: this.em_half_volume_1_contourLevel,
                        color: 0x6EC96E,
                        alpha: 0.20
                    }
                ],
                {
                    isLazy: true,
                    entryId: 'halfmap1'
                }
            );
        }
        if (this.em_half_volume_2_url !== 'undefined') {
            viewerInstance.loadVolumeFromUrl(
                {
                    url: this.em_half_volume_2_url,
                    format: 'dscif',
                    isBinary: true
                },
                [
                    {
                        type: 'absolute',
                        value: this.em_half_volume_2_contourLevel,
                        color: 0x6EC96E,
                        alpha: 0.20
                    }
                ],
                {
                    isLazy: true,
                    entryId: 'halfmap2'
                }
            );
        }
        if (this.em_additional_volume_1_url !== 'undefined') {
            viewerInstance.loadVolumeFromUrl(
                {
                    url: this.em_additional_volume_1_url,
                    format: 'dscif',
                    isBinary: true
                },
                [
                    {
                        type: 'absolute',
                        value: this.em_additional_volume_1_contourLevel,
                        color: 0xff0000,
                        alpha: 0.20
                    }
                ],
                {
                    isLazy: true,
                    entryId: 'additionalvolume'
                }
            );
        }
        if (this.map_xray_1_url !== 'undefined') {
            viewerInstance.loadVolumeFromUrl(
                {
                    url: this.map_xray_1_url,
                    format: 'dscif',
                    isBinary: true
                },
                [{
                    type: 'relative',
                    value: 1,
                    color: 0x3362B2,
                    alpha: 0.20,

                },
                    {
                        type: 'relative',
                        value: 3,
                        color: 0xBB3333,
                        alpha: 0.20,
                        volumeIndex: 1
                    },
                    {
                        type: 'relative',
                        value: -3,
                        color: 0xBB3333,
                        alpha: 0.20,
                        volumeIndex: 1
                    }],
                {
                    isLazy: false,
                    entryId: ['2FO-FC', 'FO-FC'],
                }
            );
        }
    });
}
function uploadFile(serviceUrl, formElementId, progressElementId) {
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    var serviceData = {};
    serviceData = getServiceContext();
    logContext("Starting uploadFile ");
    $(progressElementId).find('div').hide();
    var options = {
        // target:        acknowledgeElementId,   // target element(s) updated with server response 
        // beforeSubmit:  showRequest,    // pre-submit callback 
        //  success:       showResponse,   // post-submit callback 
      // beforeSubmit: function() {
      //	     serviceData = getServiceContext();
      // },
          beforeSubmit: function (arr, $form, options) {
	            arr.push({
                        "name": "sessionid",
                        "value": sessionId
                    });
                    arr.push({
                        "name": "entryid",
                        "value": entryId
                    });
                    arr.push({
                        "name": "entrymodelfilename",
                        "value": entryModelFileName
                    });
                    arr.push({
                        "name": "entrysffilename",
                        "value": entrySfFileName
                    });
      },

        beforeSend: function () {
            $(progressElementId).find('div').show();
            status.empty();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        complete: function (xhr) {
	        var tS,tJ;
	        if (xhr.responseText.startsWith("<textarea>")) {
		        tS = $(xhr.responseText).val();
	        } else {
		        tS = xhr.responseText;
	        }
	        tJ = $.parseJSON(tS);
	        status.html(tJ.htmlcontent);
	        if ("entryid" in tJ) {
		        entryId = tJ.entryid;
	        }
	        if ("entrymodelfilename" in tJ) {
		        entryModelFileName = tJ.entrymodelfilename;
		        $("#new-entry-form").show();	    	
	        }
	        if ("entrysffilename" in tJ) {
		        entrySfFileName = tJ.entrysffilename;
	        }
	        logContext("After file upload");
	        appendContextToMenuUrls();
	        $(progressElementId).find('div').hide(3000);
        },
	    // data: serviceData
        dataType: 'json'
        
    };
    $(formElementId).ajaxForm(options);
}
function newSession(context) {
    var retObj;
    clearServiceContext();
    var serviceData = getServiceContext();
    logContext("Calling newsession ");
    //$.ajax({url: newSessionServiceUrl, async: false, data: {context: context}, type: 'post', success: assignSession } );
    $.ajax({
        url: newSessionServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    //
    assignContext(retObj);
    logContext("After newsession ");
    appendContextToMenuUrls();
}
function updateDownloadOptions(jsonObj) {
    var url;
    var el;
    var fn;
    var arr;
    var htmlS;
    if ("logfiles" in jsonObj) {
        arr = jsonObj.logfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-logfiles").html(htmlS);
            $("#download-logfiles-label").html("Log files:");
            $("#download-logfiles").show();
            $("#download-logfiles-label").show();
        }
    }

}

function getSessionInfo() {
    var retObj;
    var serviceData = getServiceContext();
    logContext("Calling getSessionInfo() for entry " + entryId);
    $.ajax({
        url: getSessionInfoServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    return retObj;
}

function appendContextToMenuUrls() {
    // append the current session id to menu urls

    $("fieldset legend a, #top-menu-options li a" ).attr('href', function (index, href) {
        ret = href.split("?")[0];
        if (sessionId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'sessionid=' + sessionId;
        }
        if (entryId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryid=' + entryId;
        }
        if (entryModelFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entrymodelfilename=' + entryModelFileName;
        }
        if (entrySfFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entrysffilename=' + entrySfFileName;
        }
        //console.log("index = " + index + " href " + href + " ret = " + ret);
        return ret;
    });
    //JDW ###

}

function getEntryInfo() {
    logContext("Calling getEntryInfo");
    var entryInfoUrl = '/service/review_v2/entryinfo';
    var serviceData = getServiceContext();
    $.ajax({
        url: entryInfoUrl,
        async: true,
        data: serviceData,
        dataType: 'json',
        type: 'post',
        success: function (jsonObj) {
	    if ("struct_title" in jsonObj  && jsonObj.struct_title.length > 0) {
		$('#my_title').remove();
		$('.page-header').append('<h5 id="my_title"> Title: ' + jsonObj.struct_title + '</h5>');
	    }
            if ("comb_id" in jsonObj && jsonObj.comb_id.length > 0) {
                $('title').html("Rev: " + jsonObj.comb_id);
	    } else if ("pdb_id" in jsonObj && jsonObj.pdb_id != null && jsonObj.pdb_id.length > 0) {
		$('title').html("Rev: " + jsonObj.pdb_id + '/' + entryId);
	    }
        }
    });
    //
    logContext("After getEntryInfo ");
}

function assignContext(jsonObj) {
    sessionId = jsonObj.sessionid;
    //  message  =jsonObj.htmlcontent;
    errorFlag = jsonObj.errorflag;
    errorText = jsonObj.errortext;
    if ('entryid' in jsonObj) {
        entryId = jsonObj.entryid;
    }
    if ('entrymodelfilename' in jsonObj) {
        entryModelFileName = jsonObj.entrymodelfilename;
    }
    if ('entrysffilename' in jsonObj) {
        entrySfFileName = jsonObj.entrysffilename;
    }

    //console.log("Assigning - session id " + sessionId + " entry id " + entryId + " entry filename " + entryModelFileName);
}


function getCurrentContext() {

    if ((typeof startupFromService != 'undefined') && startupFromService) {
	sessionId=startupSessionId;
	entryId=startupEntryId;
	standaloneMode=false;
    }


    var myUrl = $(location).attr('href');
    params = $.url(myUrl).param();
    pagePath = $.url(myUrl).attr('relative');
    if ("sessionid" in params) {
        sessionId = params.sessionid;
    }
    if ("entryid" in params) {
        entryId = params.entryid;
	$("title").html("Rev: "+ entryId);
	$("#subheader").html(entryId);
    }
    if ("entrymodelfilename" in params) {
        entryModelFileName = params.entrymodelfilename;
    }
    if ("entrysffilename" in params) {
        entrySfFileName = params.entrysffilename;
    }
    logContext("after getCurrentContext()" + pagePath);
}

function clearServiceContext() {
  sessionId='';
  entryId='';
  entryModelFileName='';
  entrySfFileName='';
}

function getServiceContext() {
    var sc = {};
    sc.sessionid = sessionId;
    sc.entryid = entryId;
    sc.entrymodelfilename = entryModelFileName;
    sc.entrysffilename = entrySfFileName;
    sc.useversion = 1;
    return sc;
}

function progressStart() {
    $("#loading").fadeIn('slow').spin("large", "black");
}

function progressEnd() {
    $("#loading").fadeOut('fast').spin(false);
}

function updateCompletionStatus(jsonObj, statusId) {
    var errFlag = jsonObj.errorflag;
    var statusText = jsonObj.statustext;
    //  if (errText.length > 0 ) {
    if (errFlag) {
        $(statusId + ' div.op-status').html(statusText);
        $(statusId + ' div.op-status').addClass('error-status');
    } else {
        $(statusId + ' div.op-status').html(statusText);
        $(statusId + ' div.op-status').removeClass('error-status');
    }
    $(statusId + ' div.op-status').show();
}

function updateReportContent(jsonObj, contentId) {
    var retHtml = jsonObj.htmlcontent;
    var errFlag = jsonObj.errorflag;
    logContext('Updating report content  = ' + contentId);
    if (! errFlag) {
	    logContext('Updating report content  with = ' + retHtml);
	    logContext('Selection container ' + $(contentId).length  ); 
	    logContext('Selection report div ' + $(contentId + ' div.report-content').length  ); 
	    //$(contentId + ' div.report-content').append(retHtml);
	    $(contentId + ' div.report-content').html(retHtml);
	    $(contentId + ' div.report-content').show();
	    bindDowloadEvents();
    }
}

function updateLinkContent(jsonObj, contentId) {
    var retHtml = jsonObj.htmllinkcontent;
    var errFlag = jsonObj.errorflag;
    logContext('Updating link content id = ' + contentId);
    if (retHtml.length > 0) {
      logContext('Updating link content  with = ' + retHtml);
      logContext('Selection container ' + $(contentId).length  ); 
      logContext('Selection link div '  + $(contentId + ' div.op-links').length  ); 
      $(contentId + ' div.op-links ').html(retHtml);
      $(contentId + ' div.op-links ').show();
    }
}

function setupSideBar() {
    /*
     *   For control of side nav bar -- 
     */
    var $window = $(window);
    var $body = $(document.body);
    
    var navHeight = $('.navbar').outerHeight(true) + 10;
    $body.scrollspy({
	target: '.bs-sidebar',
	offset: navHeight
    });
	
    $window.on('load', function() {
	$body.scrollspy('refresh')
    });
    
    $('.bs-docs-container [href=#]').click(function(e) {
	e.preventDefault()
    });
    
    // back to top
    setTimeout(function() {
	var $sideBar = $('.bs-sidebar')
	
	$sideBar.affix({
            offset: {
		top: function() {
                    var offsetTop = $sideBar.offset().top
                    var sideBarMargin = parseInt($sideBar.children(0).css('margin-top'), 10)
                    var navOuterHeight = $('.bs-docs-nav').height()
                    return (this.top = offsetTop - navOuterHeight - sideBarMargin)
		},
		bottom: function() {
                    return (this.bottom = $('.bs-footer').outerHeight(true))
		}
            }
	})
    }, 100);
}

function handleCLoseWindow() {
    var inFormOrLink;
    $('a').on('click', function() { inFormOrLink = true; });
    $('form').on('submit', function() { inFormOrLink = true; });
    
    $(window).bind('beforeunload', function(eventObject) {
	var returnValue = undefined;
	if (! inFormOrLink) {
	    returnValue = "Do you really want to close?";
	}
	eventObject.returnValue = returnValue;
	return returnValue;
    });
}

//
// ## File download ##
//
function bindDowloadEvents() {
    $('a.my-file-downloadable').bind('click',function(event){
        logContext('Launch download');
	event.preventDefault();
	params = $.url(this.href).param();
	mypath = $.url(this.href).attr('path');
	mydownload(mypath,params);

    });
}

function mydownload(url,params) {
    var $iframe = $('<iframe style="visibility: collapse;"></iframe>');
    $('body').append($iframe);
    var content = $iframe[0].contentDocument;
    var $form = $('<form action="' + url + '" method="GET"></form>');
    //
    if ("sessionid" in params) {
	$form.append('<input type="hidden" name="sessionid" value="'+params.sessionid+'" />');
    }
    if ("entryid" in params) {
	$form.append('<input type="hidden" name="file_source" value="'+params.entryid+'" />');
    }
    if ("file_path" in params) {
	$form.append('<input type="hidden" name="file_path" value="'+params.file_path+'" />');
    }
    $form.append('<input type="hidden" name="my_bug" value="BUGGIES" />');
    //
    content.write($form.clone().wrap('<div>').parent().html());
    $('form', content).submit();
    setTimeout((function(iframe) {
	return function() {
	    iframe.remove();
	}
    })($iframe), 2000);
}

//
// Document ready entry point
//

$(document).ready(function () {

    logContext('Ready function starting with session id  = ' + sessionId);
    $("#uploadProgress").find('*').hide();
    getCurrentContext();
    appendContextToMenuUrls();

    if (sessionId.length == 0) {
        newSession('request session');
        logContext('Assigning new session id  = ' + sessionId);
    }
    logContext('Selection report container ' + $('#review-report-container').length  ); 

    if ( ($(".url-list").length > 0) || ($("#consolidated-report-section").length > 0) ) {
	getEntryInfo();
    }


    if ($("#review-admin-dialog").length > 0) {

         <!-- review inline idops form -->
         $('#review-inline-idops-form').ajaxForm({
	        url: reviewIdOpsUrl,
                dataType: 'json',
                success: function (jsonObj) {
                    logContext("Operation completed");

                    updateCompletionStatus(jsonObj, '#review-inline-idops-form');
		    updateLinkContent(jsonObj,      '#review-inline-idops-form');
		    updateReportContent(jsonObj,    '#review-report-container');
		    $('#review-report-container  div.report-content').show();
                    $('#review-inline-idops-button').show();
                    progressEnd();
		    if ("entryid" in jsonObj  && jsonObj.entryid.length > 0) {
			$("title").html("Rev: "+ jsonObj.entryid);
			$("#subheader").html(jsonObj.entryid);	
			entryId=jsonObj.entryid;
			getEntryInfo();
		    }
		    if ($("#consolidated-report-section").length > 0) {    
			setupSideBar();
		    }    

                },
                beforeSubmit: function (arr, $form, options) {
		    $('#review-inline-idops-form div.op-status').hide();
		    $('#review-inline-idops-form div.op-links').hide();
		    $('#review-report-container  div.report-content').hide();

                    progressStart();
                    $('#review-inline-idops-button').hide();
                    arr.push({
                        "name": "sessionid",
                        "value": sessionId
                    });
                }
         });

         <!-- review inline fileops form -->
         $('#review-inline-fileops-form').ajaxForm({
	        url: reviewFileOpsUrl,
             dataType: 'json',
             success: function (jsonObj) {
                 logContext("Operation completed");
                
                 updateCompletionStatus(jsonObj, '#review-inline-fileops-form');
		         updateLinkContent(jsonObj,      '#review-inline-fileops-form');
		         updateReportContent(jsonObj, '#review-report-container');
		         $('#review-report-container  div.report-content').show();
                 $('#review-inline-fileops-button').show();
		         if (("entryid" in jsonObj)  && (jsonObj.entryid != null) && (jsonObj.entryid.length > 0)) {
			         $("title").html("Rev: "+ jsonObj.entryid);
			         $("#subheader").html(jsonObj.entryid);			
			         entryId=jsonObj.entryid;
			         getEntryInfo();
		         }
                 progressEnd();        
             },
             beforeSubmit: function (arr, $form, options) {
		         $('#review-inline-idops-form div.op-status').hide();
		         $('#review-inline-idops-form div.op-links').hide();
		         $('#review-report-container  div.report-content').hide();
                 
                 progressStart();
                 $('#review-inline-fileops-button').hide();
                 arr.push({
                     "name": "sessionid",
                     "value": sessionId
                 });
             }
         });
        
    }
    
    
    if ($("#consolidated-report-section").length > 0) {    
	setupSideBar();
    }    

    //   <!-- make the nav item for the current page active -->
   $('.nav a[href="' + pagePath + '"]').parent().addClass('active');
    handleCLoseWindow();    
}); // end-ready

