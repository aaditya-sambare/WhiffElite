const stores = [
  {
    name: "Snitch",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "DB Mall, Op MP Nagar f-27 Zone-1, on Khasra 1511 & 1509, Arera Hills, Bhopal, Madhya Pradesh 462011",
    contact: "9876543210",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Max",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "DB Mall, Op MP Nagar f-27 Zone-1, on Khasra 1511 & 1509, Arera Hills, Bhopal, Madhya Pradesh 462011",
    contact: "9876543210",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Westside",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "DB Mall, Op MP Nagar f-27 Zone-1, on Khasra 1511 & 1509, Arera Hills, Bhopal, Madhya Pradesh 462011",
    contact: "9876543210",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "levis",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "DB Mall, Op MP Nagar f-27 Zone-1, on Khasra 1511 & 1509, Arera Hills, Bhopal, Madhya Pradesh 462011",
    contact: "9876543210",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Peter england",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "Shop No. 1, 1st Floor, Madhya Bharat House, 68, Plot No. 82 Malviya Nagar, New Market, TT Nagar, Bhopal, Madhya Pradesh 462003",
    contact: "9165478329",
    landmark: "Near New Market",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Chhabra 555",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "Treasure Island Mall, Indore, MP",
    contact: "7314062323",
    landmark: "Near Treasure Island Mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Kapda Bazar",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "Kapda Bazar, Indore, MP",
    contact: "7312553123",
    landmark: "Near Kapda Bazar",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "P.N. Bhandari & Sons",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "M.P. Nagar, Indore, MP",
    contact: "7312551234",
    landmark: "Near M.P. Nagar",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Madhuram Saree Center",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "Khajuri Bazaar, Indore, MP",
    contact: "7312481983",
    landmark: "Near Khajuri Bazaar",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Jainam Fashions",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "Madhuram Market, Indore, MP",
    contact: "7312556655",
    landmark: "Near Madhuram Market",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Moti Ram & Sons",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Moti Ram & Sons, Gwalior, MP",
    contact: "7512345678",
    landmark: "Near Moti Ram & Sons",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Shree Sitaram Saree Emporium",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Shree Sitaram Saree Emporium, Gwalior, MP",
    contact: "7512501234",
    landmark: "Near Shree Sitaram Saree Emporium",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Kishore Babu Fashion House",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Kishore Babu Fashion House, Gwalior, MP",
    contact: "7512348973",
    landmark: "Near Kishore Babu Fashion House",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Shankar Garments",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Shankar Garments, Gwalior, MP",
    contact: "7512320111",
    landmark: "Near Shankar Garments",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Satish Garments",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Satish Garments, Gwalior, MP",
    contact: "7512322234",
    landmark: "Near Satish Garments",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Sadar Bazaar Saree House",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Sadar Bazaar, Jabalpur, MP",
    contact: "7612501234",
    landmark: "Near Sadar Bazaar",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Naina Fashions",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Naina Fashions, Jabalpur, MP",
    contact: "7612512345",
    landmark: "Near Naina Fashions",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Goyal Garments",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Goyal Garments, Jabalpur, MP",
    contact: "7612534567",
    landmark: "Near Goyal Garments",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Shubham Saree Center",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Shubham Saree Center, Jabalpur, MP",
    contact: "7612597890",
    landmark: "Near Shubham Saree Center",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Samdariya Fashion House",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Samdariya Fashion House, Jabalpur, MP",
    contact: "7612333444",
    landmark: "Near Samdariya Fashion House",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Shree Ganesh Cloth House",
    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Shree Ganesh Cloth House, Ujjain, MP",
    contact: "7342524567",
    landmark: "Near Shree Ganesh Cloth House",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Panditji Saree Center",
    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Panditji Saree Center, Ujjain, MP",
    contact: "7342527890",
    landmark: "Near Panditji Saree Center",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Agarwal Garments",
    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Agarwal Garments, Ujjain, MP",
    contact: "7342541234",
    landmark: "Near Agarwal Garments",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Soni Fashion House",
    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Soni Fashion House, Ujjain, MP",
    contact: "7342552345",
    landmark: "Near Soni Fashion House",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Jai Ambe Clothing",
    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Jai Ambe Clothing, Ujjain, MP",
    contact: "7342567890",
    landmark: "Near Jai Ambe Clothing",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Nike",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "F-29 First Floor, Nike Store, Dainik Bhaskar Mall, DB City Mall, Zone-I, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462011",
    contact: "7556644121",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "Calvin Klien",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "G-38, Jail Rd, DB City Mall, Zone-I, Arera Hills, Bhopal, Madhya Pradesh 462016",
    contact: "9876543210",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
  {
    name: "US Polo Assn.",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address:
      "F 21 & 22 First floor, Dainik Bhaskar Mall, DB City Mall, Zone-I, Hills, Bhopal, Madhya Pradesh 462016",
    contact: "7556644300",
    landmark: "DB mall",
    image:
      "https://cdn.vectorstock.com/i/500p/32/57/gold-shopping-bag-logo-vector-15003257.jpg",
  },
];

module.exports = stores;