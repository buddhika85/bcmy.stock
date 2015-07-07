using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Web;

namespace BCMY.WebAPI.Util
{
    public static class GeneralValidator   
    {
        
        /// <summary>
        /// string validation
        /// </summary>        
        public static bool IsStringNotEmpty(string str)
        {
            if (string.IsNullOrEmpty(str) || string.IsNullOrWhiteSpace(str))
            {
                return false;
            }
            else 
            {
                return true;
            }
        }

        /// <summary>
        /// number validation
        /// Ref - https://social.msdn.microsoft.com/Forums/windows/en-us/84990ad2-5046-472b-b103-f862bfcd5dbc/how-to-check-string-is-number-or-not-in-c/
        /// </summary>
        public static bool IsNumeric (Object Expression)
        {
            if(Expression == null || Expression is DateTime)
                return false;

            if(Expression is Int16 || Expression is Int32 || Expression is Int64 || Expression is Decimal || 
                Expression is Single || Expression is Double || Expression is Boolean)
                return true;

            try
            {
                if (Expression is string)
                    Double.Parse(Expression as string);
                else
                    Double.Parse(Expression.ToString());
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// decimal number validation
        /// </summary>
        public static bool IsDecimalNumber(Object Expression)
        {
            try
            {
                if (Expression is string)
                    Double.Parse(Expression as string);
                else
                    Double.Parse(Expression.ToString());
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// checks whether the passed string has specified number of characters
        /// </summary>
        public static bool IsStringWithLength(string str, int length)
        {
            if (length != 0 && IsStringNotEmpty(str))
            {
                if (str.Length == length)
                    return true;
                else
                    return false;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// checks whether the passed number has specified number of characters
        /// </summary>
        public static bool IsNumberWithLength(object number, int length)
        {
            if (length != 0 && IsNumeric(number))
            {
                if (number.ToString().Length == length)
                    return true;
                else
                    return false;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// checks whether the passed string has an element of the passed string list
        /// </summary>
        public static bool IsOneOfStringList(string str, List<string> strList)
        {
            bool isFound = false;
            if (IsStringNotEmpty(str) || strList == null || (! strList.Any()))
            {
                foreach (string item in strList)
                {
                    if (item.Trim().Equals(str.Trim()))
                    {
                        isFound = true;
                        break;
                    }
                }
            }
            return isFound;
        }

        /// <summary>
        /// Used to validate a provided string with a regex pattern
        /// Ref - http://stackoverflow.com/questions/5342375/c-sharp-regex-email-validation
        /// </summary>
        public static bool IsValidEmailAddress(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        /// <summary>
        /// Used to validate a provided string with a regex pattern
        /// </summary>
        public static bool IsValidRegexString(string str, string pattern)
        { 
            bool isValidStr = false;
            Regex regex = new Regex(pattern);
            Match match = regex.Match(str);
            if (match.Success)
            {
                isValidStr = true;
            }
            return isValidStr;
        }
    }
}