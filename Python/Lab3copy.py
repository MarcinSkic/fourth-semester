from math import radians, cos, sin, asin, sqrt


class Geopoint:

    def __init__ (self,name,lat,lon):
        self.name = name
        self.lat = lat
        self.lon = lon

    def __eq__ (self,o):
        return o.lat == self.lat and o.lon == self.lon

    def __str__ (self):
        return f'lat: {self.lat}, lon: {self.lon}'

    def __repr__(self):
        return f'{self.name}: {self.lat} {self.lon}'

    def __lt__(self,o):
        return Geopoint.haversine(self.lon,self.lat,22.52222,51.21167) < Geopoint.haversine(o.lon,o.lat,22.52222,51.21167) 

    @staticmethod
    def haversine(lon1, lat1,lon2,lat2):

        # convert decimal degrees to radians
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2,
        lat2])
        # haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon /
        2)**2
        c = 2 * asin(sqrt(a))
        # Radius of earth in kilometers is 6371
        meters = 6371000 * c
        return meters

x = Geopoint('a',51.21782,22.54583)
y = Geopoint('b',51.21353,22.54142)
z = Geopoint('c',51.21483,22.52527)
ż = Geopoint('d',51.22352,22.55640)
ź = Geopoint('comparePoint',51.21167,22.52222)

lista = [x,y,z,ż,ź]
print(lista)
lista.sort()
print(lista)