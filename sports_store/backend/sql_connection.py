import mysql.connector
__cnx = None

def get_sql_connection():
    global __cnx
    if __cnx is None:
        __cnx = mysql.connector.connect(user='root', password='dachu',
                                        host='localhost',
                                        port=3306,
                                        database='sports_store') 
    return __cnx