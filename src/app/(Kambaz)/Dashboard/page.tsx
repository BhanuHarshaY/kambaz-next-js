import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt='ReactJS thumbnail' />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/PDP.jpg" width={200} height={150} alt='PDP thumbnail' />
            <div>
              <h5> CS5010 Program Design Paradigm </h5>
              <p className="wd-dashboard-course-title">
                Program Design patterns 
              </p>
              <button> Go </button>
            </div>
          </Link> 
          </div>
        <div className="wd-dashboard-course"> <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/DBMS.jpg" width={200} height={150} alt='DBMS thumbnail' />
            <div>
              <h5> CS5200 DBMS </h5>
              <p className="wd-dashboard-course-title">
                Database Management System
              </p>
              <button> Go </button>
            </div>
          </Link> </div>
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/algo.jpg" width={200} height={150} alt='Algo thumbnail' />
            <div>
              <h5> CS5800 Algorithms </h5>
              <p className="wd-dashboard-course-title">
                Algorithm design and analysis
              </p>
              <button> Go </button>
            </div>
          </Link>
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/ML.jpg" width={200} height={150} alt='ML thumbnail' />
            <div>
              <h5> CS6140 Machine learning </h5>
              <p className="wd-dashboard-course-title">
               ML models and applications
              </p>
              <button> Go </button>
            </div>
          </Link>
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/NLP.jpg" width={200} height={150} alt='NLP thumbnail' />
            <div>
              <h5> CS6120 NLP </h5>
              <p className="wd-dashboard-course-title">
                Natural Language Processing
              </p>
              <button> Go </button>
            </div>
          </Link>
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/webdev.jpg" width={200} height={150} alt='Web dev thumbnail' />
            <div>
              <h5> CS5610 Web Devlopment </h5>
              <p className="wd-dashboard-course-title">
                Full Stack devlopment
              </p>
              <button> Go </button>
            </div>
          </Link>
      </div>
    </div>
);}
