# Facebook-API-Scraper-Ecommerce

The project is a robust application that leverages Google Apps Script to fetch, parse, and log Facebook insights data.

In the project, there are several important functions like FBInsightsRenner, runPagingUrl, getService, authCallback, logRedirectUri, and parseResultIntoSpreadsheetRennerXXL.

In FBInsightsRenner, it connects to the Facebook Graph API and fetches data based on parameters including the date range, action report time, and action attribution windows, among other things. It sends a GET request with fields including spend, actions, action values, account name, CPM, impressions, website CTR, and outbound clicks CTR.

runPagingUrl function fetches the data using pagination URL for large data sets.

In getService, it returns the OAuth2 service configured for Facebook.

The authCallback handles the OAuth callback, ensuring authorized access to the Facebook account.

The logRedirectUri function logs the redirect URI that is needed for OAuth process.

parseResultIntoSpreadsheetRennerXXL function processes the returned data, parsing the JSON and writing the relevant results to a Google Spreadsheet.

The script also includes provisions for actions including 'landing_page_view', 'link_click', 'offsite_conversion.fb_pixel_add_payment_info', 'offsite_conversion.fb_pixel_add_to_cart', 'offsite_conversion.fb_pixel_initiate_checkout' and 'offsite_conversion.fb_pixel_purchase'.

The data is then written into a Google Spreadsheet, allowing you to easily analyze your Facebook insights data.
