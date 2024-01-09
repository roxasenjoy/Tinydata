import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';


export const SIGNIN_USER_MUTATION = gql`
  mutation login($login: String!, $password: String!) {
    postToken(login: $login, password: $password) {
      token
      rank
      inscriptionDate
    }
  }
`;

export const FORGOTPWD_USER_MUTATION = gql`
  mutation reset(
    $email: String!
  ) {
    forgotPassword(email: $email)
  }
`;

export const RESETPWD_USER_MUTATION = gql`
  mutation resetPassword(
    $email: String!
    $validationCode: String!
    $password: String!
  ) {
    resetPassword(
      email: $email
      validationCode: $validationCode
      password: $password
    )
  }
`;

export const CurrentUserForProfile = gql`
  query user {
    user {
      id
      firstName
      lastName
      fullName
      gender
      phone
      profile{
          jobTitle
      }
      companyName
      company{
        id
        name
      }
      email
      session
      score
      cgu
      lowsAcquisitions
      fortsAcquisitions
      picture
      inscriptionDate
      image {
        url
      }
      hasCompanyAnalytics
      hasTinyAnalytics
      allowNotification
      roles
    }
  }
`;

@Injectable({
	providedIn: 'root',
})
export class GET_USER_BY_ID extends Query<Response>{
	document = gql`
  query userById($id: UserInt) {
    userById(id: $id) {
      email
      companyName
      firstName
      lastName
      company{
        id
      }
    }
  }
 `;
}

export const GET_USERS = gql`
  query($idAccount: UserInt, $searchText: String){
    users(idAccount : $idAccount, searchText : $searchText){
      id
      email
      firstName
      lastName
      fullName
    }
  }
`;

export const RESEARCH_USERS = gql`
  query($value: String){
    researchUsers(value: $value){
      id
      email
      firstName
      lastName
      fullName
    }
  }
`;


export const LOGIN = gql`
  mutation login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
    }
  }
`;

export const LOGIN_TINYDATA = gql`
  mutation login($login: String!, $password: String!,$passwordRemember: Boolean!) {
    login(login: $login, password: $password, passwordRemember: $passwordRemember) {
      token
    }
  }
`;

export const GET_TINYSUITE_TOKEN = gql`
  query {
    tinysuiteToken
  }
`;


export const DAY_CONNECTION = gql`
  mutation dayConnection(
    $location: String!
    $latitude: Float!
    $longitude: Float!
    $browser: String!
    $browser_version: String!
    $device: String!
    $os: String!
    $os_version: String!
    $userAgent: String!
    $firebaseToken: String
    $context: String!
  ) {
    dayConnection(
      location: $location
      latitude: $latitude
      longitude: $longitude
      browser: $browser
      browser_version: $browser_version
      device: $device
      os: $os
      os_version: $os_version
      userAgent: $userAgent
      firebaseToken: $firebaseToken
      context: $context
    )
  }
`;

export const TINYDATA_RESEARCH_BAR = gql`
   query researchBar($researchBar: String!) {
    researchBar(researchBar: $researchBar){
        objectId
        title
        type
      }
  }
`;

export const TINYDATA_FILTER = gql`
  query filter(
       $beginDate: String!,
       $endDate: String!,
       $parcours: [String!],
       $entreprise: [CompanyInt!]) {
      filter(
          beginDate: $beginDate,
          endDate: $endDate,
          parcours: $parcours,
          entreprise: $entreprise){
        id
        date
        parcours
        entreprise
        }
    }
`;

export const SIGNUP_TINYDATA_USER_MUTATION = gql`
  mutation
        signUpTinydata(
          $email: String!,
          $firstName: String,
          $lastName: String,
          $phone: String,
          $cgu: Boolean!)
      {
       signUpTinydata(
         email: $email,
         firstName: $firstName,
         lastName: $lastName,
         phone: $phone,
         cgu: $cgu)
      }
`;

export const INITIALIZE_ACCOUNT = gql`
  mutation
    initializeAccount($oldPassword: String!, $newPassword: String!)
    {
      initializeAccount(oldPassword: $oldPassword, newPassword: $newPassword){
        token
      }
    }
`;

export const GET_COMPANIES_NAME = gql`
  query($joinCompany: Boolean) {
    company(joinCompany: $joinCompany) {
        id
        name
        childs{
            id
            name
            childs{
              id
              name
              childs{
                id
                name
                childs{
                  id
                  name
                  childs{
                    id
                    name
                    childs{
                      id
                      name
                      childs{
                        id
                        name
                        childs{
                          id
                          name
                          childs{
                            id
                            name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }
  }
`;

export const GET_ALL_COMPANIES_NAMES = gql`
  query companiesNames($idCompany: CompanyInt){
    companiesNames(idCompany: $idCompany){
      inCompany
    }
  }
`;

export const GET_COMPANY_NAME = gql`
   query companyNameById($id: CompanyInt){
    companyNameById(id: $id) {
      id
      name
    }
  }
`;

export const GET_COMPANY_OBJECTIFS = gql`
   query companyObjectifs($objectifsFilter: [String]){
    companyObjectifs(objectifsFilter: $objectifsFilter) {
      id
      name
      completed
      color
    }
  }
`;

@Injectable({
	providedIn: 'root',
})
export class TINYDATA_GET_TOTAL_GRANULARITIES extends Query<Response>{
	document = gql`
    query($companies: [CompanyInt]){
      totalGranularities(companies: $companies){
          total
      }
    }
  `;
}


@Injectable({
	providedIn: 'root',
})
export class TINYDATA_GET_GRANULARITIES extends Query<Response>{
	document = gql`
    query($companies: [CompanyInt], $matrixFilter: [MatrixInt], $userId: Int){
      granularities(companies: $companies, matrixFilter: $matrixFilter, userId: $userId){
          id
          name
          domains{
              id
              title
              skills{
                  id
                  title
                  themes{
                      id
                      title
                  }
              }
          }
      }
    }
  `;
}

@Injectable({
	providedIn: 'root',
})
export class TINYDATA_FILTER_FORMATION_WITH_DATA extends Query<Response>{
	document = gql`
    query filterFormationWithData($companies: [CompanyInt], $matrixFilter: [MatrixInt], $userId: Int, $nameFilter: String, $beginDate: String, $endDate: String){
      filterFormationWithData(companies: $companies, matrixFilter: $matrixFilter, userId: $userId, nameFilter: $nameFilter, beginDate: $beginDate, endDate:$endDate){
          matrixID
          name
          hasData
      }
    }
  `;
}

export const TINYDATA_GET_CONNECTIONS = gql`
    query($idUser: UserInt, $organisationsFilter: [CompanyInt], $beginDate : String, $endDate: String, $groupedBy: String, $groupByUser: Boolean){
      connections(idUser:$idUser, organisationsFilter:$organisationsFilter, beginDate:$beginDate, endDate:$endDate, groupedBy:$groupedBy, groupByUser:$groupByUser){
          name
          companyId
          data{
              date
              count
              totalCount
              percentage
              text
              userFirstName
              userLastName
              userEmail
          }
      }
    }
`;

export const verifyUserInformation = gql`
  mutation verifyUser($userId: UserInt!, $value: String!, $type: String!) {
    verifyUser(userId:$userId, value: $value, type: $type) {
      firstName
      lastName
      profile{
          jobTitle
      }
      companyName
      email
      token
    }
  }
`;

export const updatePassword = gql`
  mutation updatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword:$oldPassword, newPassword: $newPassword){
      token
    }
  }
`;

@Injectable({
	providedIn: 'root',
})
export class GET_COMPANIES_INFORMATION extends Query<Response>{
	document = gql`
  query companyInformation($idCompany: CompanyInt!) {
    companyInformation(idCompany: $idCompany){
            id
            name
            typeContract
            beginContract
            endContract
            number_users
            users_active
            formations
            parcours
      }
  }
 `;
}

export const GET_USER_IS_SUPER_ADMIN = gql`
  query {
    userIsSuperAdmin
  }
`;

export const GET_USER_IS_SUPER_ADMIN_CLIENT = gql`
  query {
    userIsSuperAdminClient
  }
`;

export const GET_USER_ACCOUNT = gql`
  query{
    account{
      id
      email
      firstName
      lastName
      organisation{
          id
          name
      }
    }
  }
`;


/** Unité solo sur la page dashboard */
export const GET_TOTAL_LEARNING_TIME_PER_USER = gql`
query totalLearningTimePerUser(
  $beginDate: String,
  $endDate: String,
  $organisationsFilter: [CompanyInt],
  $idUser: UserInt
) {
  totalLearningTimePerUser(
      beginDate: $beginDate,
      endDate: $endDate,
      organisationsFilter: $organisationsFilter,
      idUser: $idUser
    )
    {
      totalTime
      lastInteraction
      userClient{
          user{
              id
              firstName
              lastName
              email
          }
      }
    }
  }
`;

export const GET_TOTAL_LEARNING_TIME = gql`
query totalLearningTime(
  $beginDate: String,
  $endDate: String,
  $matrixFilter: [MatrixInt],
  $domainFilter: [DomainInt],
  $skillFilter: [SkillInt],
  $themeFilter: [ThemeInt],
  $organisationsFilter: [CompanyInt],
  $userTotalLearningTime: Boolean,
  $idUser: UserInt
) {
  totalLearningTime(
      beginDate: $beginDate,
      endDate: $endDate,
      matrixFilter: $matrixFilter,
      domainFilter: $domainFilter,
      skillFilter: $skillFilter,
      themeFilter: $themeFilter,
      organisationsFilter: $organisationsFilter,
      userTotalLearningTime: $userTotalLearningTime,
      idUser: $idUser
    )
  }
`;

export const GET_TOTAL_SKILL = gql`
query totalConnection(
  $beginDate: String,
  $endDate: String,
  $organisationsFilter: [CompanyInt],
  $userTotalConnection: Boolean,
) {
  totalConnection(
      beginDate: $beginDate,
      endDate: $endDate,
      organisationsFilter: $organisationsFilter,
      userTotalConnection: $userTotalConnection
    )
  }
`;

export const GET_TOTAL_CONTENT_VALID = gql`
query totalContentValid(
  $beginDate: String,
  $endDate: String,
  $matrixFilter: [MatrixInt],
  $domainFilter: [DomainInt],
  $skillFilter: [SkillInt],
  $themeFilter: [ThemeInt],
  $organisationsFilter: [CompanyInt],
  $userTotalContentValid: Boolean,
  $user: UserInt
) {
  totalContentValid(
      beginDate: $beginDate,
      endDate: $endDate,
      matrixFilter: $matrixFilter,
      domainFilter: $domainFilter,
      skillFilter: $skillFilter,
      themeFilter: $themeFilter,
      organisationsFilter: $organisationsFilter,
      userTotalContentValid: $userTotalContentValid,
      user: $user
    ){
      value
      total
    }
  }
`;

export const GET_TOTAL_CONTENT_INVALID = gql`
query totalContentValid(
  $beginDate: String,
  $endDate: String,
  $matrixFilter: [MatrixInt],
  $domainFilter: [DomainInt],
  $skillFilter: [SkillInt],
  $themeFilter: [ThemeInt],
  $organisationsFilter: [CompanyInt],
  $userTotalContentValid: Boolean,
  $user: UserInt
) {
  totalContentInvalid(
      beginDate: $beginDate,
      endDate: $endDate,
      matrixFilter: $matrixFilter,
      domainFilter: $domainFilter,
      skillFilter: $skillFilter,
      themeFilter: $themeFilter,
      organisationsFilter: $organisationsFilter,
      userTotalContentValid: $userTotalContentValid,
      user: $user
    ){
      value
      total
    }
  }
`;

export const GET_TOTAL_CONTENT_REMAINING = gql`
query totalContentRemaining(
  $beginDate: String,
  $endDate: String,
  $matrixFilter: [MatrixInt],
  $domainFilter: [DomainInt],
  $skillFilter: [SkillInt],
  $themeFilter: [ThemeInt],
  $organisationsFilter: [CompanyInt],
  $userTotalContentValid: Boolean,
  $user: UserInt
) {
  totalContentRemaining(
      beginDate: $beginDate,
      endDate: $endDate,
      matrixFilter: $matrixFilter,
      domainFilter: $domainFilter,
      skillFilter: $skillFilter,
      themeFilter: $themeFilter,
      organisationsFilter: $organisationsFilter,
      userTotalContentValid: $userTotalContentValid,
      user: $user
    ){
      value
      total
    }
  }
`;

export const GET_TOTAL_APPRENANTS = gql`
  query activeUsers($organisationsFilter: [CompanyInt], $user: UserInt) {
    activeUsers(
      organisationsFilter: $organisationsFilter
      user: $user
    ){
        value
        total
    }
  }
`;

export const GET_TOTAL_CONNECTION = gql`
query totalConnection(
  $beginDate: String,
  $endDate: String,
  $organisationsFilter: [CompanyInt],
  $userTotalConnection: Boolean,
  $idUser: UserInt
) {
  totalConnection(
      beginDate: $beginDate,
      endDate: $endDate,
      organisationsFilter: $organisationsFilter,
      userTotalConnection: $userTotalConnection,
      idUser: $idUser
    )
  }
`;

export const GET_EMAIL_OPEN_ACCOUNTS = gql`
  query emailOpenAccounts(
    $beginDate: String,
    $endDate: String,
    $companyId: Int,
    $formationId: Int

  ) {
    emailOpenAccounts(
        beginDate: $beginDate,
        endDate: $endDate,
        companyId: $companyId,
        formationId: $formationId
      ){

        firstName
        lastName
        email
        dateOpenAccount
        formationName
        companyName
      }
    }
`;

export const GET_OPEN_ACCOUNTS = gql`
query openAccounts(
  $beginDate: String,
  $endDate: String,
  $matrixFilter: [MatrixInt],
  $organisationsFilter: [CompanyInt]

) {
  openAccounts(
      beginDate: $beginDate,
      endDate: $endDate,
      matrixFilter: $matrixFilter,
      organisationsFilter: $organisationsFilter
    ){
      dataGraphic{
        name
        children{ 
            value
            name
            children{
                value
                name
                children{
                    value
                    name
                    children{
                        value
                        name
                        children{
                            value
                            name
                            children{
                                value
                                name
                                children{
                                  value
                                  name
                                  children{
                                    value
                                    name
                                    children{
                                      value
                                      name
                                      children{
                                        value
                                        name
                                    }
                                  }
                                }
                              }
                            }
                        }
                    }
                }
            }
        }
    }
    dataExtended{
        formationName
        name
        subName
        companyId
        formationId
        depth
        value
        allEmails{
          firstName
          lastName
          roles
          email
          date
          organisation
          sousOrganisation
          formation
        }
    }
    }
  }
`;


export const GET_FEEDBACK = gql`
    query feedback(
      $beginDate: String,
      $endDate: String,
      $matrixFilter: [MatrixInt],
      $domainFilter: [DomainInt],
      $skillFilter: [SkillInt],
      $themeFilter: [ThemeInt],
      $organisationsFilter: [CompanyInt],
      $idGranularity: Int,
      $idUser: Int,
      $formationZoom: Int,
      $actualGranularity: Int

    ) {
      feedback(
          beginDate: $beginDate,
          endDate: $endDate,
          matrixFilter: $matrixFilter,
          domainFilter: $domainFilter,
          skillFilter: $skillFilter,
          themeFilter: $themeFilter,
          organisationsFilter: $organisationsFilter,
          idGranularity: $idGranularity,
          idUser: $idUser,
          formationZoom: $formationZoom,
          actualGranularity: $actualGranularity
        ){
          idMatrix
          data{
              Bien
              Difficile
              Facile
              Long
              idGranularityFeedback
              name
          }
          feedbackDetailed{
              depth
              name
              feedbackName
              percentage
          }
        }
      }
    `;


// @Injectable({
//   providedIn: 'root',
// })
// export class GET_FEEDBACK extends Query<Response>{
//   document = gql`
//     query feedback(
//       $beginDate: String,
//       $endDate: String,
//       $matrixFilter: [MatrixInt],
//       $domainFilter: [DomainInt],
//       $skillFilter: [SkillInt],
//       $themeFilter: [ThemeInt],
//       $organisationsFilter: [CompanyInt],
//       $idGranularity: Int,
//       $idUser: Int,
//       $formationZoom: Int,
//       $actualGranularity: Int

//     ) {
//       feedback(
//           beginDate: $beginDate,
//           endDate: $endDate,
//           matrixFilter: $matrixFilter,
//           domainFilter: $domainFilter,
//           skillFilter: $skillFilter,
//           themeFilter: $themeFilter,
//           organisationsFilter: $organisationsFilter,
//           idGranularity: $idGranularity,
//           idUser: $idUser,
//           formationZoom: $formationZoom,
//           actualGranularity: $actualGranularity
//         ){
//           idMatrix
//           data{
//               Bien
//               Difficile
//               Facile
//               Long
//               idGranularityFeedback
//               name
//           }
//           feedbackDetailed{
//               depth
//               name
//               feedbackName
//               percentage
//           }
//         }
//       }
//     `;
// }

export const GET_USER_CONTRIBUTIONS = gql`
  query userContributions(
    $beginDate: String,
    $endDate: String,
    $matrixFilter: [MatrixInt],
    $domainFilter: [DomainInt],
    $skillFilter: [SkillInt],
    $themeFilter: [ThemeInt],
    $organisationsFilter: [CompanyInt],
    $idGranularity: Int,
    $idUser: Int,
    $formationZoom: Int,
    $actualGranularity: Int
  ) {
    userContributions(
        beginDate: $beginDate,
        endDate: $endDate,
        matrixFilter: $matrixFilter,
        domainFilter: $domainFilter,
        skillFilter: $skillFilter,
        themeFilter: $themeFilter,
        organisationsFilter: $organisationsFilter,
        idGranularity: $idGranularity,
        idUser: $idUser,
        formationZoom: $formationZoom,
        actualGranularity: $actualGranularity
      ){
        idMatrix
        data{
            total
            idGranularityFeedback
            name
        }
        feedbackDetailed{
            firstName
            lastName
            email
            groupePrincipal
            groupe
            message
            nameMatrix
            nameDomain
            nameSkill
            nameTheme
            nameAcquis
            nameContent
        }
      }
    }
    `;

// A supprimer si non fonctionnel
export const GET_CONTENTS_VALID = gql`
  query contentsValid(
    $matrixFilter: [MatrixInt],
    $domainFilter: [DomainInt],
    $skillFilter: [SkillInt],
    $themeFilter: [ThemeInt],
    $beginDate: String,
    $endDate: String,
    $organisationsFilter: [CompanyInt],
    $idMatrix: MatrixInt,
    $idUser: UserInt,
    $isExtended: Boolean

  ) {
      contentsValid(
        beginDate: $beginDate,
        endDate: $endDate,
        matrixFilter: $matrixFilter,
        domainFilter: $domainFilter,
        skillFilter: $skillFilter,
        themeFilter: $themeFilter,
        organisationsFilter: $organisationsFilter,
        idMatrix: $idMatrix,
        idUser: $idUser,
        isExtended: $isExtended
      ){
        nameMatrix
        idMatrix
        contentValidated
        contentFailed
        contentTotal
        contentNeverDone
        data{
          nameMatrix
          nameDomain
          nameSkill
          nameTheme
          nameAcquis
          nameContent
          category
          categoryName
          id
        }
        link{
          source
          target
        } 
      }
    }
`;

/***************
 * Granularités
 **************/

/* Return la moyenne de tous les contenus */
@Injectable({
	providedIn: 'root',
})
export class GET_GENERAL_PROGRESSION extends Query<Response>{
	document = gql`
  query generalProgression(
    $userEmail: String,
    $beginDate: String,
    $endDate: String,
    $matrixFilter: [MatrixInt],
    $domainFilter: [DomainInt],
    $skillFilter: [SkillInt],
    $themeFilter: [ThemeInt],
    $acquisitionFilter: [AcquisitionInt],
    $contentFilter: [String],
    $levelsFilter: [String],
    $objectivesFilter: [String],
    $organisationsFilter: [CompanyInt],
    $userGeneralProgression: Boolean,
    $userId: UserInt
    $filterFormationSelected: String

  ) {
      generalProgression(
        userEmail: $userEmail,
        beginDate: $beginDate,
        endDate: $endDate,
        matrixFilter: $matrixFilter,
        domainFilter: $domainFilter,
        skillFilter: $skillFilter,
        themeFilter: $themeFilter,
        acquisitionFilter: $acquisitionFilter,
        contentFilter: $contentFilter,
        levelsFilter: $levelsFilter,
        objectivesFilter: $objectivesFilter,
        organisationsFilter: $organisationsFilter,
        userGeneralProgression: $userGeneralProgression,
        userId: $userId,
        filterFormationSelected: $filterFormationSelected
      ){
        data{
          name
          value
        }
        meanValue
      }
    }
 `;
}

@Injectable({
	providedIn: 'root',
})
export class GET_TOTAL_TIME_SPENT_IN_LEARNING extends Query<Response>
{
	document = gql`
  query totalTimeSpentInLearning(
    $beginDate: String,
    $endDate: String,
    $organisationsFilter: [CompanyInt],
    $userTotalLearningTime: [UserInt]
  ) {
      totalTimeSpentInLearning(
        beginDate: $beginDate,
        endDate: $endDate,
        organisationsFilter: $organisationsFilter,
        userTotalLearningTime: $userTotalLearningTime
      ){
        meanLearning,
        data,
        name        
      }
    }
 `;
}


/**
 * StorageFilterType a build dans le back
 * A voir pour SpecificGraphData
 * 
 * DATA = JSON Stringify
 * 
 */
export const GET_DATA = gql`
  query graphData(
    $filterType: [StorageFilter], 
    $graphName: String,
    $specificGraphData: String
  ) {
    graphData(
        filterType: $filterType,
        graphName: $graphName,
        specificGraphData: $specificGraphData
      ){
        data
      }
    }
`;

/**
 * StorageFilterType a build dans le back
 * A voir pour SpecificGraphData
 * 
 * DATA = JSON Stringify
 * 
 */
export const GET_RAW_DATA = gql`
	query rawData(
		$filterType: [StorageFilter], 
		$graphName: String,
		$specificGraphData: String
	) {
		rawData(
			filterType: $filterType,
			graphName: $graphName,
			specificGraphData: $specificGraphData
		)
		{
			data
		}
	}

`;





@Injectable({
	providedIn: 'root',
})
export class GET_PERFORMANCE extends Query<Response>{
	document = gql`
    query performance(
		$beginDate: String,
		$endDate: String,
		$matrixFilter: [MatrixInt],
		$domainFilter: [DomainInt],
		$skillFilter: [SkillInt],
		$themeFilter: [ThemeInt],
		$acquisitionFilter: [AcquisitionInt],
		$organisationsFilter: [CompanyInt],
		$userId: Int,
		$nameDepth: String,
		$depthClickedID: Int,
		$filterFormationSelected: String,
    $performanceZoom: Int

    ) {
      performance(
			beginDate: $beginDate,
			endDate: $endDate,
			matrixFilter: $matrixFilter,
			domainFilter: $domainFilter,
			skillFilter: $skillFilter,
			themeFilter: $themeFilter,
			acquisitionFilter: $acquisitionFilter,
			organisationsFilter: $organisationsFilter,
			userId: $userId,
			nameDepth: $nameDepth,
			depthClickedID: $depthClickedID,
			filterFormationSelected: $filterFormationSelected,
      performanceZoom: $performanceZoom
		){

        dataGraphic{
          granularityID
          name
          depth
          value
        }

        dataExtended{
          companyName
          depth
          firstName
          lastName
          email
          granularityID
          name
          value
        }
      }
    }
 `;
}
