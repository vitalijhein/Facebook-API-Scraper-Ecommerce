function FBInsightsRenner(pastDay, today )
{

	var service = getService();
	if ( service.hasAccess() )
	{
    today = new Date();
    pastDay = new Date();
    pastDay.setDate(today.getDate()-100);
    today = today.toISOString().slice(0,10);
    pastDay = pastDay.toISOString().slice(0,10);
    Logger.log(today);
    Logger.log(pastDay);

		var fields = "?fields=spend,actions,action_values,account_name,cpm,impressions,website_ctr,outbound_clicks_ctr,frequency";
		var params = "&time_increment=1&action_report_time=conversion&action_attribution_windows=['7d_click','1d_view']&limit=1000&time_range[since]="+ pastDay + "&time_range[until]=" + today;
    //&date_preset=last_90d&limit=1000";
		//&time_range[since]="+ pastDay + "&time_range[until]=" + today;
		//


		var url = "https://graph.facebook.com/v14.0/act_8446640896/insights";


		var response = UrlFetchApp.fetch( url + fields + params,
		{
			headers:
			{
				'Authorization': 'Bearer ' + service.getAccessToken()
			}
		} );
		var result = JSON.parse( response.getContentText() );
		Logger.log( JSON.stringify( result, null, 2 ) );
		parseResultIntoSpreadsheetRennerXXL( result );
	}
	else
	{
		var authorizationUrl = service.getAuthorizationUrl();
		Logger.log( 'Open the following URL and re-run the script: %s',
			authorizationUrl );
	}
}



function runPagingUrl( url )
{

	var service = getService();
	if ( service.hasAccess() )
	{

		var response = UrlFetchApp.fetch( url,
		{
			headers:
			{
				'Authorization': 'Bearer ' + service.getAccessToken()
			}
		} );
		var result = JSON.parse( response.getContentText() );
		Logger.log( JSON.stringify( result, null, 2 ) );
		parseResultIntoSpreadsheetRennerXXL( result );
	}
	else
	{
		var authorizationUrl = service.getAuthorizationUrl();
		Logger.log( 'Open the following URL and re-run the script: %s',
			authorizationUrl );
	}
}

function runFBInsghts()
{
	Logger.log( FBInsights( 'act_844664089672819', '2021-07-09', '2021-07-09' ) );
}

/**
 * Configures the service.
 */
function getService()
{
	return OAuth2.createService( 'Facebook' )
		// Set the endpoint URLs.
		.setAuthorizationBaseUrl( 'https://www.facebook.com/dialog/oauth' )
		.setTokenUrl( 'https://graph.facebook.com/oauth/access_token' )

		// Set the client ID and secret.
		.setClientId( CLIENT_ID )
		.setClientSecret( CLIENT_SECRET )

		// Set the name of the callback function that should be invoked to
		// complete the OAuth flow.
		.setCallbackFunction( 'authCallback' )

		// Set the property store where authorized tokens should be persisted.
		.setPropertyStore( PropertiesService.getUserProperties() );
}

/**
 * Handles the OAuth callback.
 */
function authCallback( request )
{
	var service = getService();
	var authorized = service.handleCallback( request );
	if ( authorized )
	{
		return HtmlService.createHtmlOutput( 'Success!' );
	}
	else
	{
		return HtmlService.createHtmlOutput( 'Denied.' );
	}
}

/**
 * Logs the redict URI to register.
 */
function logRedirectUri()
{
	Logger.log( OAuth2.getRedirectUri() );
}

/**
 * Logs the redirect URI to register.
 */
function logRedirectUri()
{
	var service = getService();
	Logger.log( service.getRedirectUri() );
}


function parseResultIntoSpreadsheetRennerXXL( result )
{

	var sumOfDays = Object.keys( result.data ).length;
	Logger.log( sumOfDays );
	//Logger.log(sumOfActions);
	var ss = SpreadsheetApp.openById( "1WtBNY_0scLDuPn6Xi_fau36FWy6QDGfupC5QxQMFF6I" );
	var sheet = ss.getSheetByName("raw data rennerxxl");
  //LOGGER.log(sheet);
  appendEmptyRow(sheet);
  deleteRowsRXXL(sheet);
  createHeader(sheet);
  
	for ( var i = 0; i < sumOfDays; i++ )
	{
  var day; 
  var account_name="";
  var spend=0;
  var link_click_7d_click=0;
  var landing_page_view_7d_click=0;
  var fb_pixel_view_content_unified_attribution=0;
  var fb_pixel_add_to_cart_unified_attribution=0;
  var fb_pixel_initiate_checkout_unified_attribution=0;
  var fb_pixel_add_payment_info_unified_attribution=0;
  var fb_pixel_purchase_unified_attribution=0;
  var fb_pixel_purchase_action_values_unified_attribution=0;
  var cpm=0;
  var impressions=0;
  var website_ctr=0;
  var frequency=0;
		Logger.log( "Day #" + i );
			if ( typeof ( result.data[ i ].actions) !== "undefined" ){
		var sumOfActions = Object.keys( result.data[ i ].actions ).length;}
    if ( typeof ( result.data[ i ].action_values) !== "undefined" ){
		var sumOfActionsValues = Object.keys( result.data[ i ].action_values ).length;}
		//Logger.log(result.data[i].date_start);
		day = result.data[ i ].date_start;
    Logger.log(result.data[ i ].frequency);
    Logger.log("FREQUENZ");
		if ( typeof ( result.data[ i ].frequency ) !== "undefined" )
		{
			frequency = result.data[ i ].frequency;
      frequency = parseFloat(frequency);
		}
		else
		{
			//Logger.log("frequency = 0 ");
			frequency = 0;
		}

		//Logger.log("##########################################");
		if ( typeof ( result.data[ i ].spend ) !== "undefined" )
		{
			//Logger.log(result.data[i].spend);
			spend = result.data[ i ].spend;
      spend = parseFloat(spend);

		}
		else
		{
			//Logger.log("spend = 0 ");
			spend = 0;
		}
		//Logger.log(result.data[i].account_name);
		account_name = result.data[ i ].account_name;

		if ( typeof ( result.data[ i ].impressions ) !== "undefined" )
		{
			//Logger.log(result.data[i].impressions);
			impressions = result.data[ i ].impressions;
		}
		else
		{
			//Logger.log("impressions = 0 ");
			impressions = 0;
		}

		if ( typeof ( result.data[ i ].cpm ) !== "undefined" )
		{
			Logger.log(result.data[i]);
			cpm = result.data[ i ].cpm;
      cpm = parseFloat(cpm);
		}
		else
		{
			//Logger.log("cpm = 0 ");
			cpm = 0;
		}

		if ( typeof ( result.data[ i ].website_ctr ) !== "undefined" )
		{
			Logger.log(result.data[i].website_ctr[0].value);
		  website_ctr = result.data[ i ].website_ctr[ 0 ].value;
      website_ctr = parseFloat(website_ctr);


		}
		else
		{
			//Logger.log("website_ctr = 0 ");
			website_ctr = 0;
		}

		if ( typeof ( result.data[ i ].outbound_clicks_ctr ) !== "undefined" )
		{
			Logger.log(result.data[i].outbound_clicks_ctr[0].value);
			var outbound_clicks_ctr = result.data[ i ].outbound_clicks_ctr[ 0 ].value;

		}
		else
		{
			//Logger.log("outbound_clicks_ctr = 0 ");
			var outbound_clicks_ctr = 0;
		}

		//var link_click_through_rate = ( parseFloat( outbound_clicks_ctr ) + parseFloat( website_ctr ) ) / 2;

		//lp view
    if ( typeof ( result.data[ i ].action_values) !== "undefined" ){
		for ( var j = 0; j < sumOfActions; j++ )
		{
			Logger.log( "Action #" + j );
			if ( result.data[ i ].actions[ j ].action_type == "landing_page_view" )
			{
				Logger.log( result.data[ i ].actions[ j ].action_type );
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				var landing_page_view_action_type = result.data[ i ].actions[ j ].action_type;
				landing_page_view_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];

			}
			if ( result.data[ i ].actions[ j ].action_type == "link_click" )
			{
				//link clicks
				Logger.log( result.data[ i ].actions[ j ].action_type );
				var link_click_action_type = result.data[ i ].actions[ j ].action_type;
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				link_click_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];
			}
			//offsite_conversion.fb_pixel_add_payment_info
			if ( result.data[ i ].actions[ j ].action_type == "offsite_conversion.fb_pixel_add_payment_info" )
			{
				//Logger.log(result.data[i].actions[j].action_type);
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				//Logger.log(Number(parseFloat(result.data[i].actions[j]["1d_view"])));
				var fb_pixel_add_payment_info_action_type = result.data[ i ].actions[ j ].action_type;

				var fb_pixel_add_payment_info_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];
				var fb_pixel_add_payment_info_1d_view = result.data[ i ].actions[ j ][ "1d_view" ];
				if ( fb_pixel_add_payment_info_7d_click == null )
				{
					fb_pixel_add_payment_info_7d_click = 0;
				}
				if ( fb_pixel_add_payment_info_1d_view == null )
				{
					fb_pixel_add_payment_info_1d_view = 0;
				}
				fb_pixel_add_payment_info_unified_attribution = parseInt( fb_pixel_add_payment_info_7d_click ) + parseInt( fb_pixel_add_payment_info_1d_view );
				//Logger.log("fb_pixel_add_payment_info_unified_attribution: " + fb_pixel_add_payment_info_unified_attribution);

			}
			//offsite_conversion.fb_pixel_add_to_cart
			if ( result.data[ i ].actions[ j ].action_type == "offsite_conversion.fb_pixel_add_to_cart" )
			{
				//Logger.log(result.data[i].actions[j].action_type);
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				//Logger.log(result.data[i].actions[j]["1d_view"]);
				var fb_pixel_add_to_cart_info_action_type = result.data[ i ].actions[ j ].action_type;
				var fb_pixel_add_to_cart_info_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];
				var fb_pixel_add_to_cart_info_1d_view = result.data[ i ].actions[ j ][ "1d_view" ];
				if ( fb_pixel_add_to_cart_info_7d_click == null )
				{
					fb_pixel_add_to_cart_info_7d_click = 0;
				}
				if ( fb_pixel_add_to_cart_info_1d_view == null )
				{
					fb_pixel_add_to_cart_info_1d_view = 0;
				}
				fb_pixel_add_to_cart_unified_attribution = parseInt( fb_pixel_add_to_cart_info_7d_click ) + parseInt( fb_pixel_add_to_cart_info_1d_view );
			}
			//offsite_conversion.fb_pixel_initiate_checkout
			if ( result.data[ i ].actions[ j ].action_type == "offsite_conversion.fb_pixel_initiate_checkout" )
			{
				//Logger.log(result.data[i].actions[j].action_type);
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				//Logger.log(result.data[i].actions[j]["1d_view"]);
				var fb_pixel_initiate_checkout_action_type = result.data[ i ].actions[ j ].action_type;
				var fb_pixel_initiate_checkout_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];
				var fb_pixel_initiate_checkout_1d_view = result.data[ i ].actions[ j ][ "1d_view" ];
				if ( fb_pixel_initiate_checkout_7d_click == null )
				{
					fb_pixel_initiate_checkout_7d_click = 0;
				}
				if ( fb_pixel_initiate_checkout_1d_view == null )
				{
					fb_pixel_initiate_checkout_1d_view = 0;
				}
				fb_pixel_initiate_checkout_unified_attribution = parseInt( fb_pixel_initiate_checkout_7d_click ) + parseInt( fb_pixel_initiate_checkout_1d_view );
			}

			//offsite_conversion.fb_pixel_purchase

			if ( result.data[ i ].actions[ j ].action_type == "offsite_conversion.fb_pixel_purchase" )
			{
				//Logger.log(result.data[i].actions[j].action_type);
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				//Logger.log(result.data[i].actions[j]["1d_view"]);
				var fb_pixel_purchase_action_type = result.data[ i ].actions[ j ].action_type;
				var fb_pixel_purchase_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];
				var fb_pixel_purchase_1d_view = result.data[ i ].actions[ j ][ "1d_view" ];
				if ( fb_pixel_purchase_7d_click == null )
				{
					fb_pixel_purchase_7d_click = 0;
				}
				if ( fb_pixel_purchase_1d_view == null )
				{
					fb_pixel_purchase_1d_view = 0;
				}
				fb_pixel_purchase_unified_attribution = parseInt( fb_pixel_purchase_7d_click ) + parseInt( fb_pixel_purchase_1d_view );
			        var fb_pixel_purchase_value = result.data[ i ].actions[ j ][ "value" ];
	      if ( fb_pixel_purchase_value == null )
				{
					fb_pixel_purchase_value = 0;
				}
        if (fb_pixel_purchase_unified_attribution < fb_pixel_purchase_value)
        {
          fb_pixel_purchase_unified_attribution = fb_pixel_purchase_value
        }
      }


			if ( result.data[ i ].actions[ j ].action_type == "offsite_conversion.fb_pixel_view_content" )
			{
				//Logger.log(result.data[i].actions[j].action_type);
				//Logger.log(result.data[i].actions[j]["7d_click"]);
				//Logger.log(result.data[i].actions[j]["1d_view"]);
				var fb_pixel_view_content_action_type = result.data[ i ].actions[ j ].action_type;
				var fb_pixel_view_content_7d_click = result.data[ i ].actions[ j ][ "7d_click" ];
				var fb_pixel_view_content_1d_view = result.data[ i ].actions[ j ][ "1d_view" ];

				if ( fb_pixel_view_content_7d_click == null )
				{
					fb_pixel_view_content_7d_click = 0;
				}
				if ( fb_pixel_view_content_1d_view == null )
				{
					fb_pixel_view_content_1d_view = 0;
				}
				fb_pixel_view_content_unified_attribution = parseInt( fb_pixel_view_content_7d_click ) + parseInt( fb_pixel_view_content_1d_view );
			}
		}
    }



		// action values
		//lp view
		for ( var j = 0; j < sumOfActionsValues; j++ )
		{
			if ( result.data[ i ].action_values[ j ].action_type == "landing_page_view" )
			{
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				var landing_page_view_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var landing_page_view_action_values_action_type = result.data[ i ].action_values[ j ][ "7d_click" ];
			}
			if ( result.data[ i ].action_values[ j ].action_type == "link_click" )
			{
				//link clicks
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				var link_click_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var link_click_action_values_action_type = result.data[ i ].action_values[ j ][ "7d_click" ];
			}
			//offsite_conversion.fb_pixel_add_payment_info
			if ( result.data[ i ].action_values[ j ].action_type == "offsite_conversion.fb_pixel_add_payment_info" )
			{
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				//Logger.log(result.data[i].action_values[j]["1d_view"]);
				var fb_pixel_add_payment_info_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var fb_pixel_add_payment_info_action_values_7d_click = result.data[ i ].action_values[ j ][ "7d_click" ];
				var fb_pixel_add_payment_info_action_values_1d_view = result.data[ i ].action_values[ j ][ "1d_view" ];
				if ( fb_pixel_add_payment_info_action_values_7d_click == null )
				{
					fb_pixel_add_payment_info_action_values_7d_click = 0;
				}
				if ( fb_pixel_add_payment_info_action_values_1d_view == null )
				{
					fb_pixel_add_payment_info_action_values_1d_view = 0;
				}
				var fb_pixel_add_payment_info_action_values_unified_attribution = parseFloat( fb_pixel_add_payment_info_action_values_7d_click ) + parseFloat( fb_pixel_add_payment_info_action_values_1d_view );
			}
			//offsite_conversion.fb_pixel_add_to_cart
			if ( result.data[ i ].action_values[ j ].action_type == "offsite_conversion.fb_pixel_add_to_cart" )
			{
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				//Logger.log(result.data[i].action_values[j]["1d_view"]);
				var fb_pixel_add_to_cart_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var fb_pixel_add_to_cart_action_values_7d_click = result.data[ i ].action_values[ j ][ "7d_click" ];
				var fb_pixel_add_to_cart_action_values_1d_view = result.data[ i ].action_values[ j ][ "1d_view" ];
			}
			if ( fb_pixel_add_to_cart_action_values_7d_click == null )
			{
				fb_pixel_add_to_cart_action_values_7d_click = 0;
			}
			if ( fb_pixel_add_to_cart_action_values_1d_view == null )
			{
				fb_pixel_add_to_cart_action_values_1d_view = 0;
			}
			var fb_pixel_add_to_cart_action_values_unified_attribution = parseFloat( fb_pixel_add_to_cart_action_values_7d_click ) + parseFloat( fb_pixel_add_to_cart_action_values_1d_view );

			//offsite_conversion.fb_pixel_initiate_checkout
			if ( result.data[ i ].action_values[ j ].action_type == "offsite_conversion.fb_pixel_initiate_checkout" )
			{
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				//Logger.log(result.data[i].action_values[j]["1d_view"]);
				var fb_pixel_initiate_checkout_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var fb_pixel_initiate_checkout_action_values_7d_click = result.data[ i ].action_values[ j ][ "7d_click" ];
				var fb_pixel_initiate_checkout_action_values_1d_view = result.data[ i ].action_values[ j ][ "1d_view" ];
				if ( fb_pixel_initiate_checkout_action_values_7d_click == null )
				{
					fb_pixel_initiate_checkout_action_values_7d_click = 0;
				}
				if ( fb_pixel_initiate_checkout_action_values_1d_view == null )
				{
					fb_pixel_initiate_checkout_action_values_1d_view = 0;
				}
				var fb_pixel_initiate_checkout_action_values_unified_attribution = parseFloat( fb_pixel_initiate_checkout_action_values_7d_click ) + parseFloat( fb_pixel_initiate_checkout_action_values_1d_view );
			}
			//offsite_conversion.fb_pixel_purchase

			if ( result.data[ i ].action_values[ j ].action_type == "offsite_conversion.fb_pixel_purchase" )
			{
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				//Logger.log(result.data[i].action_values[j]["1d_view"]);
				var fb_pixel_purchase_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var fb_pixel_purchase_action_values_7d_click = result.data[ i ].action_values[ j ][ "7d_click" ];
				var fb_pixel_purchase_action_values_1d_view = result.data[ i ].action_values[ j ][ "1d_view" ];
				if ( fb_pixel_purchase_action_values_7d_click == null )
				{
					fb_pixel_purchase_action_values_7d_click = 0;
				}
				if ( fb_pixel_purchase_action_values_1d_view == null )
				{
					fb_pixel_purchase_action_values_1d_view = 0;
				}
				fb_pixel_purchase_action_values_unified_attribution = parseFloat( fb_pixel_purchase_action_values_7d_click ) + parseFloat( fb_pixel_purchase_action_values_1d_view );
			}
			if ( result.data[ i ].action_values[ j ].action_values == "offsite_conversion.fb_pixel_view_content" )
			{
				//Logger.log(result.data[i].action_values[j].action_type);
				//Logger.log(result.data[i].action_values[j]["7d_click"]);
				//Logger.log(result.data[i].action_values[j]["1d_view"]);
				var fb_pixel_view_content_action_values_action_type = result.data[ i ].action_values[ j ].action_type;
				var fb_pixel_view_content_action_values_7d_click = result.data[ i ].action_values[ j ][ "7d_click" ];
				var fb_pixel_view_content_action_values_1d_view = result.data[ i ].action_values[ j ][ "1d_view" ];

				if ( fb_pixel_view_content_action_values_7d_click == null )
				{
					fb_pixel_view_content_action_values_7d_click = 0;
				}
				if ( fb_pixel_view_content_action_values_1d_view == null )
				{
					fb_pixel_view_content_action_values_1d_view = 0;
				}
				var fb_pixel_view_content_action_values_unified_attribution = parseFloat( fb_pixel_view_content_action_values_7d_click ) + parseFloat( fb_pixel_view_content_action_values_1d_view );

			}

		}
   

    sheet.appendRow(
                [day,
                    account_name,
                    spend,
                    link_click_7d_click,
                    landing_page_view_7d_click,
                    fb_pixel_view_content_unified_attribution,
                    fb_pixel_add_to_cart_unified_attribution,
                    fb_pixel_initiate_checkout_unified_attribution,
                    fb_pixel_add_payment_info_unified_attribution,
                    fb_pixel_purchase_unified_attribution,
                    fb_pixel_purchase_action_values_unified_attribution,
                    cpm,
                    impressions,
                    website_ctr,
                    frequency
                ]);
	}
}
function deleteRowsRXXL(sheet){
    var start, howManyToDelete;

  start = 1;//Hard coded row number from where to start deleting

  howManyToDelete = sheet.getLastRow() - start+1;//How many rows to delete -
  //The blank rows after the last row with content will not be deleted

sheet.deleteRows(start, howManyToDelete); 
}
function createHeader(sheet){
   sheet.appendRow(
                ["Date",
                    "Account_name",
                    "Spend",
                    "link_click_7d_click",
                    "landing_page_view_7d_click",
                    "fb_pixel_view_content_unified_attribution",
                    "fb_pixel_add_to_cart_unified_attribution",
                    "fb_pixel_initiate_checkout_unified_attribution",
                    "fb_pixel_add_payment_info_unified_attribution",
                    "fb_pixel_purchase_unified_attribution",
                    "fb_pixel_purchase_action_values_unified_attribution",
                    "cpm",
                    "impressions",
                    "link_click_through_rate",
                    "frequency"
                ]);
}
function appendEmptyRow(sheet){
   sheet.appendRow(
                ["",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ]);
}